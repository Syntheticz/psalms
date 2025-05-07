import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
import * as fs from "fs";
import { faker } from "@faker-js/faker";
import * as path from "path";
const HASH_VALUE = 10 as const;

function generateRandomSalary() {
  const salaryRanges = [
    [20000, 30000],
    [35000, 55000],
    [60000, 90000],
    [80000, 120000],
    [120000, 250000],
    [40000, 80000],
    [15000, 25000],
    [30000, 70000],
  ];

  const randomIndex = Math.floor(Math.random() * salaryRanges.length);
  const selectedRange = salaryRanges[randomIndex];

  return `PHP ${selectedRange[0].toLocaleString()} - PHP ${selectedRange[1].toLocaleString()}`;
}

interface Employer {
  name: string;
  contact: string;
  email: string;
}

interface Qualification {
  requirement: string;
  possible_credentials: string[];
  categories: string[];
  priority: boolean;
}

interface CompanyData {
  name: string;
  logo?: string;
  industry?: string;
  size?: string;
  founded?: number;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
  description?: string;
}

interface JobData {
  id: number;
  company_name: string;
  company_address: string;
  contact: string;
  description: string;
  employer: Employer[];
  job_title: string;
  industry_field: string;
  priority_categories: string[];
  qualifications: Qualification[];
}

async function main() {
  // Read the JSON file
  const filePath = path.join(__dirname, "dataset.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);
  const jobDataArray: JobData[] = data["job_roles"];

  // Create employer user
  for (let index = 0; index < jobDataArray.length; index++) {
    const jobData = jobDataArray[index];

    await prisma.$transaction(async (tx) => {
      const password = await bcrypt.hash("test123", HASH_VALUE);

      const contactPerson = await tx.contactPerson.create({
        data: {
          name: faker.person.fullName(),
          contactNumber: faker.phone.number({ style: "international" }), // Philippine mobile number format
          email: faker.internet.email(),
        },
      });

      const employer = await tx.user.create({
        data: {
          name: jobData.employer[0].name,
          email: faker.internet.email(),
          password: password, // You can modify this with a more secure password or generate one
          role: "EMPLOYER", // Assuming the role is 'USER'
        },
      });

      // Generate fake social media data
      const socialMediaData = {
        linkedin: faker.internet.url(),
        twitter: faker.internet.url(),
        facebook: faker.internet.url(),
      };

      // Create SocialMedia entry
      const socialMedia = await tx.socialMedia.create({
        data: {
          linkedin: socialMediaData.linkedin,
          twitter: socialMediaData.twitter,
          facebook: socialMediaData.facebook,
        },
      });

      // Create company
      const company: CompanyData = {
        name: jobData.company_name,
        industry: jobData.industry_field,
        location: jobData.company_address,
        email: "contact@miescor.ph", // Placeholder email, modify as needed
        phone: "123-456-7890", // Placeholder phone, modify as needed
        description: jobData.description || "A description of the company.", // Placeholder description
      };

      const companyRecord = await tx.company.create({
        data: {
          name: company.name,
          industry: company.industry,
          location: company.location,
          email: company.email,
          phone: company.phone,
          description: company.description,
          userId: employer.id, // Link company to employer (assuming employer is the user)
          contactPersonId: contactPerson.id, // Link the employer as the contact person (you may want to adjust this depending on your schema)
          profileCompletion: 100, // Assuming the company profile is fully completed
          socialMediaId: socialMedia.id,
        },
      });

      // Create job and link it to the company
      const job = await tx.job.create({
        data: {
          company_name: jobData.company_name,
          company_address: jobData.company_address,
          contact: jobData.contact,
          description: jobData.description,
          job_title: jobData.job_title,
          industry_field: jobData.industry_field,
          priority_categories: jobData.priority_categories,
          salary_range: generateRandomSalary(),

          employer: {
            connect: { id: employer.id }, // Connect the created employer to the job
          },
        },
      });

      // Create qualifications for the job
      for (const qualification of jobData.qualifications) {
        await tx.qualification.create({
          data: {
            requirement: qualification.requirement,
            possible_credentials: qualification.possible_credentials,
            categories: qualification.categories,
            priority: qualification.priority,
            jobId: job.id,
          },
        });
      }

      // Create job metrics
      await tx.metrics.create({
        data: {
          jobId: job.id,
          views: 0,
          applications: 0,
          saved: 0,
          qualified: 0,
        },
      });
    });

    console.log(
      "Company, job, and qualifications have been successfully created and inserted into the database."
    );
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

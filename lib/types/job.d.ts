import { Job, Qualification } from "@prisma/client";
import { Metric } from "@prisma/client/runtime/library";

export interface JobWithRelation extends Job {
  qualifications: Qualification[];
  metrics: Metric;
}

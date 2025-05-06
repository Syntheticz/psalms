import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Star } from "lucide-react"

type Qualification = {
  id: string
  requirement: string
  possible_credentials: string[]
  categories: string[]
  priority: boolean
}

export default function QualificationsList({ qualifications }: { qualifications: Qualification[] }) {
  // Sort qualifications to show priority ones first
  const sortedQualifications = [...qualifications].sort((a, b) => {
    if (a.priority && !b.priority) return -1
    if (!a.priority && b.priority) return 1
    return 0
  })

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Job Requirements</h3>
      {sortedQualifications.length === 0 ? (
        <p className="text-muted-foreground">No qualifications specified for this job.</p>
      ) : (
        <div className="space-y-3">
          {sortedQualifications.map((qualification) => (
            <Card key={qualification.id} className={qualification.priority ? "border-primary/50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  {qualification.priority && <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />}
                  <div className="space-y-2 w-full">
                    <p className="font-medium">{qualification.requirement}</p>

                    {qualification.possible_credentials.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Accepted Credentials:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {qualification.possible_credentials.map((credential, index) => (
                            <div key={index} className="flex items-center gap-1 text-sm">
                              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{credential}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {qualification.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {qualification.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

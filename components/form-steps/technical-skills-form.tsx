"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { PlusCircle, Trash2 } from "lucide-react"

export function TechnicalSkillsForm() {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "technicalSkills",
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Technical Skills</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", category: "Technical" })}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Technical Skill
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <FormField
            control={control}
            name={`technicalSkills.${index}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className={index !== 0 ? "sr-only" : undefined}>Skill Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., JavaScript, React, Node.js" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            
            className="mb-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No technical skills added. Click the button above to add a skill.
        </p>
      )}
    </div>
  )
}

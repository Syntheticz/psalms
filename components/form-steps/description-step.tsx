"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Trash2 } from "lucide-react";

export function DescriptionStep() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Description & Benefits</h2>

      <div className="space-y-6">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your company..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Company Benefits</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ id: crypto.randomUUID(), content: "" })}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Benefit
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Benefit #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>

                  <FormField
                    control={control}
                    name={`benefits.${index}.content`}
                    rules={{ required: "Benefit content is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefit</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Comprehensive health insurance with dental and vision coverage"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No benefits added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ id: crypto.randomUUID(), content: "" })
                  }
                  className="mt-2"
                >
                  Add Your First Benefit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

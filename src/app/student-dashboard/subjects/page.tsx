
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { academic } from '@/lib/data';
import { BookOpen } from 'lucide-react';

// Group subjects by class name
const getSubjectsByClass = () => {
    const subjectsByClass = new Map<string, { id: string; name: string }[]>();
    
    // Initialize map with all classes to maintain order and include empty ones
    academic.classes.forEach(c => {
        subjectsByClass.set(c.name, []);
    });

    // Populate with subjects
    academic.subjects.forEach(subject => {
        if (subjectsByClass.has(subject.className)) {
            subjectsByClass.get(subject.className)?.push({
                id: subject.id,
                name: subject.name,
            });
        }
    });

    return subjectsByClass;
};

export default function StudentSubjectsPage() {
    const [subjectsByClass] = useState(getSubjectsByClass());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject Catalog</CardTitle>
                <CardDescription>
                    Browse all subjects offered by the school, organized by grade level.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue={academic.classes[0].name}>
                    {Array.from(subjectsByClass.entries()).map(([className, subjects]) => (
                        <AccordionItem value={className} key={className}>
                            <AccordionTrigger className="text-lg font-medium">{className}</AccordionTrigger>
                            <AccordionContent>
                                {subjects.length > 0 ? (
                                    <ul className="space-y-2 pl-4">
                                        {subjects.map((subject) => (
                                            <li key={subject.id} className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <span>{subject.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground pl-4">No subjects listed for this grade.</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

"use client"

import SemSwitcher from "@/components/switcher";
import React from "react";
import { year, batch, semesters } from '@/components/data/sem'
import { Button } from "@/components/ui/button";
import endpoint from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";


const fileTypes = ["xlsx", "xls", "csv"];

export default function SemesterUplaodPage() {

    const { toast } = useToast()
    const router = useRouter()

    const [selectedSemester, setSelectedSemester] = React.useState(semesters[0]);
    const [selectedBatch, setSelectedBatch] = React.useState(batch[0]);
    const [selectedYear, setSelectedYear] = React.useState(year[0]);

    const [studentfile, setStudentFile] = React.useState<File | undefined>(undefined);
    const [subjectfile, setSubjectFile] = React.useState<File | undefined>(undefined);

    function handleStudentFile(file: File | undefined) {
        console.log("file", file)
        setStudentFile(file);
    }

    function handleSubjectFile(file: File | undefined) {
        console.log("file", file)
        setSubjectFile(file);
    }

    function UploadFile() {
        console.log(studentfile)
        console.log(subjectfile)
        const form = new FormData();
        form.append("sem", selectedSemester['value'] as any)
        form.append("batch", selectedBatch['value'] as any)
        form.append("year", selectedYear['value'] as any)
        form.append('students', studentfile as any);
        form.append('subjects', subjectfile as any);
        endpoint.post('/add-sem/', form)
        .then(res => {
            console.log(res)
            if (res.data.status === 'success' && res.status === 201) {
                toast({
                    title: "Semester added successfully",
                    variant:"success",

                })
                router.push('/')
            }
        })
    }

    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-full flex-col items-start gap-2">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Upload Semester Details
                </h1>

                <div className='flex h-1/2 w-full flex-col items-center justify-center gap-8'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Select batch</h1>
                    <div className='flex gap-8'>
                        <SemSwitcher
                            options={semesters}
                            selectedOption={selectedSemester}
                            onOptionSelect={setSelectedSemester}
                        />
                        <SemSwitcher
                            options={batch}
                            selectedOption={selectedBatch}
                            onOptionSelect={setSelectedBatch}
                        />
                        <SemSwitcher
                            options={year}
                            selectedOption={selectedYear}
                            onOptionSelect={setSelectedYear}
                        />
                    </div>

                    <div className="flex h-80 max-h-full w-full flex-col items-center justify-center gap-4">
                        <label
                            htmlFor="StudentfileInput"
                            className="flex h-full w-full cursor-pointer flex-col items-center rounded-lg border uppercase tracking-wide"
                        >
                            <span className="flex h-full items-center justify-center text-center text-base leading-normal">
                                Select Student list
                            </span>
                            <input
                                type="file"
                                id="StudentfileInput"
                                className="hidden"
                                onChange={(e) => handleStudentFile(e.target.files?.[0])}
                            />
                        </label>

                        {
                            studentfile && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg font-semibold">Selected File</span>
                                    <span className="text-sm">{studentfile.name}</span>
                                </div>
                            )
                        }


                        <label
                            htmlFor="SubjectfileInput"
                            className="flex h-full w-full cursor-pointer flex-col items-center rounded-lg border uppercase tracking-wide"
                        >
                            <span className="flex h-full items-center justify-center text-center text-base leading-normal">
                                Select Subject list
                            </span>
                            <input
                                type="file"
                                id="SubjectfileInput"
                                className="hidden"
                                onChange={(e) => handleSubjectFile(e.target.files?.[0])}
                            />
                        </label>

                        {
                            subjectfile && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg font-semibold">Selected File</span>
                                    <span className="text-sm">{subjectfile.name}</span>
                                </div>
                            )
                        }


                        <Button
                            className="cursor-pointer rounded-lg px-4 py-2 uppercase tracking-wide"
                            onClick={UploadFile}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
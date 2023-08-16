"use client"

import SemSwitcher from "@/components/switcher";
import React, { use } from "react";
import { year, examTypes, semesters } from '@/components/data/sem'
import { Button } from "@/components/ui/button";
import endpoint from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { string } from "zod";


const fileTypes = ["xlsx", "xls", "csv"];

export default function UploadPage() {

    const { toast } = useToast();

    const router = useRouter();

    const [selectedSemester, setSelectedSemester] = React.useState(semesters[0]);
    const [selectedYear, setSelectedYear] = React.useState(year[0]);
    const [examType, setExamType] = React.useState(examTypes[0]);

    const [file, setFile] = React.useState<File | undefined>(undefined);

    function handleFile(file: File | undefined) {
        console.log("file", file)
        setFile(file);
    }

    function UploadFile() {
        console.log(file)
        const form = new FormData();
        form.append('sem', selectedSemester.value as any);
        form.append('exam_type', examType.value as any);
        form.append('year', selectedYear.value as any);
        form.append('file', file as any);
        endpoint.post('/upload/', form)
            .then(res => {
                console.log(res.data)
                if (res.status === 201 && res.data.success) {
                    toast({
                        title: "Success",
                        description: "File uploaded successfully",
                        variant: "success",
                    })
                    router.push('/')
                    
                } else {
                    console.log(res.data)
                    toast({
                        title: "Error",
                        description: "Something went wrong",
                        variant: "destructive",
                    })
                }
            }
            )
    }

    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-full flex-col items-start gap-2">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Upload Result
                </h1>

                <div className='flex h-1/2 w-full flex-col items-center justify-center gap-8'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Select Exam Type</h1>
                    <div className='flex gap-8'>
                        <SemSwitcher
                            options={semesters}
                            selectedOption={selectedSemester}
                            onOptionSelect={setSelectedSemester}
                        />
                        <SemSwitcher
                            options={examTypes}
                            selectedOption={examType}
                            onOptionSelect={setExamType}
                        />
                        <SemSwitcher
                            options={year}
                            selectedOption={selectedYear}
                            onOptionSelect={setSelectedYear}
                        />
                    </div>

                    <div className="flex h-80 max-h-full w-full flex-col items-center justify-center gap-4">
                        <label
                            htmlFor="fileInput"
                            className="flex h-full w-full cursor-pointer flex-col items-center rounded-lg  border uppercase tracking-wide"
                        >
                            <span className="flex h-full items-center justify-center text-center text-base leading-normal">
                                Select Student list
                            </span>
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={(e) => handleFile(e.target.files?.[0])}
                            />
                        </label>


                        {file &&
                            (
                                <li>
                                    {file.name}
                                </li>
                            )}


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
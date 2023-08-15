"use client"

import SemSwitcher from '@/components/switcher'
import React, { useEffect } from 'react'
import { year, batch, semesters } from '@/components/data/sem'
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/Overview';
import endpoint from '@/config/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ReloadIcon } from '@radix-ui/react-icons';
import { set } from 'zod';

type StudentDetails = {
  name: string,
  admission_id: string,
  cgpa: number,
  gender: string,
  phone: string,
  email: string,
  no_of_backlog: number,
}

type StudentData = {
  name: string,
  admission_id: string,
  cgpa: number,
  gender: string,
  total_passed: number,
  total_failed: number,
}

type SubjectData = {
  subject: string,
  pass_count: number,
  subject_code: string,
  staff_name: string
}

export default function IndexPage() {

  const { toast } = useToast()

  const { state } = useAuth()

  const router = useRouter()

  const [selectedSemester, setSelectedSemester] = React.useState(semesters[0]);
  const [selectedBatch, setSelectedBatch] = React.useState(batch[0]);
  const [selectedYear, setSelectedYear] = React.useState(year[0]);
  const [open, setOpen] = React.useState(false);

  const [totalStudents, setTotalStudents] = React.useState(0);
  const [countFailedFemales, setCountFailedFemales] = React.useState(0);
  const [countFailedMales, setCountFailedMales] = React.useState(0);
  const [totalFemale, setTotalFemale] = React.useState<StudentData[] | null>(null);
  const [totalMale, setTotalMale] = React.useState<StudentData[] | null>(null);
  const [highcgpa, setHighcgpa] = React.useState<StudentDetails[] | null>(null);
  const [subjectData, setSubjectData] = React.useState<any[] | undefined>();

  const [refresh, setRefresh] = React.useState(false);

  useEffect(() => {
  
    !state.isAuthenticated ? router.push("/login") : null
  })

  const handlebatch = async () => {
    endpoint.get(`/result-analysis?batch=${selectedBatch.value}&year=${selectedYear.value}&sem=${selectedSemester.value}`)
      .then(res => {
        if (
          res.data.female_data &&
          res.data.male_data &&
          res.data.top_cgpa &&
          res.data.subject_names_pass_counts &&
          res.data.total_student
        ) {
          setOpen(true);
          // console.log(res.data)
        } else {
          toast({
            title: "No class data found",
            description: "Please select another batch",
            variant: "destructive",
          });
        }

        if (res.data.female_data) {
          setTotalFemale(res.data.female_data);
          const countFailedFemales = res.data.female_data.filter((student: { total_failed: number; }) => student.total_failed > 0).length;
          setCountFailedFemales(countFailedFemales);
        }
        if (res.data.male_data) {
          setTotalMale(res.data.male_data);
        }
        if (res.data.top_cgpa) {
          setHighcgpa(res.data.top_cgpa);
          const countFailedMales = res.data.male_data.filter((student: { total_failed: number; }) => student.total_failed > 0).length;
          setCountFailedMales(countFailedMales);
        }
        if (res.data.subject_names_pass_counts) {
          setSubjectData(res.data.subject_names_pass_counts);
        }
        if (res.data.total_student) {
          setTotalStudents(res.data.total_student);
        }
      })
  }
 
  const RefreshStates = async () => {
    setOpen(false);
    setRefresh(false);
  }

  return (
    <section className="container grid h-screen gap-6 pb-8 md:py-10">
      <div className="flex max-w-full flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Dashboard
        </h1>
        {
          open ? (
            <div className='ml-auto items-center space-x-4'>
              {
                refresh ? (
                  <Button disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                )
                  :
                  (
                    <Button onClick={(e) => { setRefresh(true); RefreshStates()}}>Refresh Report</Button>

                  )
              }
              <Button>Generate Report</Button>
            </div>
          ) : null
        }


        {
          !open ? (

            <div className='flex h-1/2 w-full flex-col items-center justify-center gap-8'>
              <h1 className='text-2xl font-semibold tracking-tight'>Select the batch</h1>
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

              <Button onClick={() => {
                handlebatch()
                // setOpen(false)
              }}>Start Analysis</Button>
            </div>
          )
            :
            (

              <Tabs defaultValue="overview" className="w-full space-y-6 py-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics" disabled>
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="reports" disabled>
                    Reports
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="w-full space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Students
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="text-muted-foreground h-4 w-4"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <Separator className='my-1' />
                      <CardContent className='flex justify-evenly'>
                        <div className='flex flex-col items-center'>
                          <h1>Male</h1>

                          <div className="text-2xl font-bold">{totalMale?.length}</div>
                        </div>
                        <Separator orientation="vertical" />
                        <div className='flex flex-col items-center'>
                          <h1>Female</h1>

                          <div className="text-2xl font-bold">{totalFemale?.length}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Failed count
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="text-muted-foreground h-4 w-4"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <Separator className='my-1' />
                      <CardContent className='flex justify-evenly'>
                        <div className='flex flex-col items-center'>
                          <h1>Male</h1>

                          <div className="text-2xl font-bold">{countFailedMales}</div>
                        </div>
                        <Separator orientation="vertical" />
                        <div className='flex flex-col items-center'>
                          <h1>Female</h1>

                          <div className="text-2xl font-bold">{countFailedFemales}</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Male Count</CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="text-muted-foreground h-4 w-4"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <Separator className='my-1' />

                      <CardContent className='flex justify-evenly'>
                        <div className='flex flex-col items-center'>
                          <h1>Pass</h1>

                          <div className="text-2xl font-bold">{totalMale?.length ?? 0 - countFailedMales}</div>
                        </div>
                        <Separator orientation="vertical" />
                        <div className='flex flex-col items-center'>
                          <h1>Failed</h1>

                          <div className="text-2xl font-bold">{countFailedMales}</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Female Count
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="text-muted-foreground h-4 w-4"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <Separator className='my-1' />
                      <CardContent className='flex justify-evenly'>
                        <div className='flex flex-col items-center'>
                          <h1>Pass</h1>

                          <div className="text-2xl font-bold">{totalFemale?.length ?? 0 - countFailedFemales}</div>
                        </div>
                        <Separator orientation="vertical" />
                        <div className='flex flex-col items-center'>
                          <h1>Failed</h1>

                          <div className="text-2xl font-bold">{countFailedFemales}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                      <CardHeader>
                        <CardTitle>Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <Overview data={subjectData} />
                      </CardContent>
                    </Card>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>High CGPA</CardTitle>
                        <CardDescription>
                          Top 10 students with highest CGPA.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          {
                            highcgpa?.map((student: StudentDetails, index) => (
                              <div className="flex items-center">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                  <AvatarFallback>SD</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                  <p className="text-sm font-medium leading-none">{student.name}</p>
                                  <p className="text-muted-foreground text-sm">
                                    {student.admission_id}
                                  </p>
                                </div>
                                <div className="ml-auto font-medium">{student.cgpa}</div>
                              </div>
                            ))
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

            )
        }

      </div>

    </section>
  )
}

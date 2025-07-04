'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { attendanceData } from '@/lib/data';
import { Progress } from '@/components/ui/progress';

const chartConfig = {
  attendance: {
    label: 'Attendance',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function AttendancePage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center py-6">
          <CardHeader className="items-center pb-2">
            <CardDescription>Overall Attendance</CardDescription>
            <CardTitle className="text-5xl font-bold text-primary">
              {attendanceData.overallPercentage}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
            <CardDescription>
              Attendance percentage for the current week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={attendanceData.trend} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  domain={[80, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="attendance"
                  fill="var(--color-attendance)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance by Grade</CardTitle>
          <CardDescription>
            Detailed attendance breakdown for each grade level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead className="w-[200px]">Indicator</TableHead>
                <TableHead className="w-[150px] text-right">
                  Percentage
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.byGrade.map((item) => (
                <TableRow key={item.grade}>
                  <TableCell className="font-medium">{item.grade}</TableCell>
                  <TableCell>
                    <Progress
                      value={item.percentage}
                      aria-label={`${item.percentage}% attendance`}
                    />
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.percentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

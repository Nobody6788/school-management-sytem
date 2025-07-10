
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { accounting } from '@/lib/data';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expense: {
    label: 'Expense',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function FinancialReportsPage() {
    const { invoices, expenses, accountTitles, accountTypes } = accounting;

    const getAccountTitleName = (id: string) => accountTitles.find(t => t.id === id)?.name || 'N/A';

    // Calculate Profit & Loss
    const totalIncome = invoices.reduce((acc, inv) => acc + inv.items.reduce((itemAcc, item) => itemAcc + item.amount, 0), 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const incomeBreakdown = invoices
        .flatMap(inv => inv.items)
        .reduce((acc, item) => {
            const title = getAccountTitleName(item.accountTitleId);
            acc[title] = (acc[title] || 0) + item.amount;
            return acc;
        }, {} as Record<string, number>);

    const expenseBreakdown = expenses.reduce((acc, exp) => {
        const title = getAccountTitleName(exp.accountTitleId);
        acc[title] = (acc[title] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);

    const pnlChartData = Object.keys(accountTitles).map(key => {
        const title = accountTitles[key as any].name;
        return {
            name: title.length > 15 ? `${title.substring(0, 15)}...` : title,
            income: incomeBreakdown[title] || 0,
            expense: expenseBreakdown[title] || 0,
        };
    }).filter(d => d.income > 0 || d.expense > 0);
    
    // Calculate Balance Sheet (simplified)
    const cash = totalIncome - totalExpenses;
    const assets = accountTitles.filter(t => t.typeId === 'AT03');
    const liabilities = accountTitles.filter(t => t.typeId === 'AT04');
    
    // Mock values for other assets/liabilities as they are not in transactions
    const otherAssetsValue = 500000; // e.g., School Building
    const otherLiabilitiesValue = 150000; // e.g., Bank Loans
    
    const totalAssets = cash + otherAssetsValue;
    const totalLiabilities = otherLiabilitiesValue;
    const equity = totalAssets - totalLiabilities;
    

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Reports</CardTitle>
        <CardDescription>
          View detailed reports on the school's financial performance and position.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pnl">
          <TabsList>
            <TabsTrigger value="pnl">Profit & Loss Statement</TabsTrigger>
            <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pnl">
            <Card>
                <CardHeader>
                    <CardTitle>Profit & Loss Statement</CardTitle>
                    <CardDescription>An overview of income and expenses for the current period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Income</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(incomeBreakdown).map(([title, amount]) => (
                                        <TableRow key={title}>
                                            <TableCell>{title}</TableCell>
                                            <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="font-bold bg-muted/50">
                                        <TableCell>Total Income</TableCell>
                                        <TableCell className="text-right">${totalIncome.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            <Table className="mt-6">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Expenses</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {Object.entries(expenseBreakdown).map(([title, amount]) => (
                                        <TableRow key={title}>
                                            <TableCell>{title}</TableCell>
                                            <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="font-bold bg-muted/50">
                                        <TableCell>Total Expenses</TableCell>
                                        <TableCell className="text-right">${totalExpenses.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                             <Table className="mt-6">
                                <TableFooter>
                                    <TableRow className={`font-bold text-lg ${netProfit >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                        <TableCell>Net {netProfit >= 0 ? 'Profit' : 'Loss'}</TableCell>
                                        <TableCell className="text-right">${netProfit.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-center">Income vs. Expense by Category</h3>
                             <ChartContainer config={chartConfig} className="h-[400px] w-full">
                                <ResponsiveContainer>
                                    <BarChart data={pnlChartData} layout="vertical" margin={{ left: 50 }}>
                                        <CartesianGrid horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                                        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="balance-sheet">
              <Card>
                <CardHeader>
                    <CardTitle>Balance Sheet</CardTitle>
                    <CardDescription>A snapshot of the school's financial position. (Simplified)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-center">Assets</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Asset</TableHead>
                                        <TableHead className="text-right">Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>Cash</TableCell><TableCell className="text-right">${cash.toFixed(2)}</TableCell></TableRow>
                                    <TableRow><TableCell>{getAccountTitleName('ATL05')}</TableCell><TableCell className="text-right">${otherAssetsValue.toFixed(2)}</TableCell></TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="font-bold text-lg bg-muted/50">
                                        <TableCell>Total Assets</TableCell>
                                        <TableCell className="text-right">${totalAssets.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold mb-4 text-center">Liabilities & Equity</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Liability</TableHead>
                                        <TableHead className="text-right">Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>{getAccountTitleName('ATL06')}</TableCell><TableCell className="text-right">${otherLiabilitiesValue.toFixed(2)}</TableCell></TableRow>
                                </TableBody>
                                <TableFooter>
                                     <TableRow className="font-bold text-base bg-muted/50">
                                        <TableCell>Total Liabilities</TableCell>
                                        <TableCell className="text-right">${totalLiabilities.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                             <Table className="mt-6">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Equity</TableHead>
                                        <TableHead className="text-right">Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>Owner's Equity</TableCell><TableCell className="text-right">${equity.toFixed(2)}</TableCell></TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="font-bold text-lg bg-muted/50">
                                        <TableCell>Total Liabilities & Equity</TableCell>
                                        <TableCell className="text-right">${(totalLiabilities + equity).toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                </CardContent>
              </Card>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}

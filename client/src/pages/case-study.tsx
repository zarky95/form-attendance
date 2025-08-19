import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, TrendingUp, Users } from "lucide-react";

export default function CaseStudy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Case Study Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            Implementation Case Study
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Attendance Tracking System Implementation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            How organizations improve workforce management and productivity by 40% with our comprehensive attendance tracking solution.
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our attendance tracking system helps organizations streamline workforce management, 
              reduce manual processes, and gain valuable insights into employee productivity patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">40%</div>
                <div className="text-sm text-muted-foreground">Productivity Increase</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Attendance Accuracy</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">60%</div>
                <div className="text-sm text-muted-foreground">Time Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <CardTitle>Daily Attendance Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Employees can easily clock in/out, record breaks, and specify work locations. 
                The system automatically calculates total hours and overtime.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <CardTitle>Employee Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive employee profiles with department organization, 
                position tracking, and status management for better workforce visibility.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <CardTitle>Analytics & Reporting</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time analytics provide insights into attendance patterns, 
                productivity trends, and help identify areas for improvement.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <CardTitle>Time Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated time calculations, overtime tracking, and break time management 
                ensure accurate payroll and compliance with labor regulations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Implementation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Before Implementation</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Manual time tracking with paper-based systems</li>
                  <li>Inconsistent attendance recording</li>
                  <li>Time-consuming payroll calculations</li>
                  <li>Limited visibility into workforce patterns</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">After Implementation</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Automated digital attendance tracking</li>
                  <li>Real-time attendance monitoring</li>
                  <li>Streamlined payroll processing</li>
                  <li>Data-driven workforce insights</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Workforce Management?</h2>
          <p className="text-muted-foreground mb-6">
            Start tracking attendance and boost your team's productivity today.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-start-tracking">
              Start Tracking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
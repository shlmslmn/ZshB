import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  CheckSquare,
  PlusCircle,
  MessageSquare,
  Filter,
  Grid3x3,
  List,
  Search,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  Flag,
  Archive,
  TrendingUp,
  Users,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "in-progress" | "flagged" | "completed" | "approved" | "invoiced" | "paid" | "archived";
  category: "operations" | "service" | "training" | "maintenance";
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  estimatedTime: string;
  assignmentType: "internal" | "external";
  checklist: string[];
}

interface Message {
  id: string;
  taskId: string;
  author: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

const TasksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("new-task");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  // Mock tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "TASK-001",
      title: "Fix HVAC System in Guest Wing A",
      description: "Air conditioning not working properly in rooms 301-310",
      priority: "urgent",
      status: "in-progress",
      category: "maintenance",
      assignedTo: "John Smith - Maintenance",
      dueDate: "2024-01-16",
      createdAt: "2024-01-15T09:00:00",
      estimatedTime: "3 hours",
      assignmentType: "internal",
      checklist: ["Inspect unit", "Replace filter", "Test system", "Document fix"],
    },
    {
      id: "TASK-002",
      title: "Deep Clean Banquet Hall",
      description: "Post-event cleanup and deep cleaning of main banquet hall",
      priority: "high",
      status: "completed",
      category: "operations",
      assignedTo: "Sarah Johnson - Housekeeping",
      dueDate: "2024-01-15",
      createdAt: "2024-01-14T14:00:00",
      estimatedTime: "4 hours",
      assignmentType: "internal",
      checklist: ["Vacuum", "Polish floors", "Clean fixtures", "Restock supplies"],
    },
  ]);

  // Mock messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "MSG-001",
      taskId: "TASK-001",
      author: "Manager",
      content: "Has the HVAC unit been inspected yet?",
      timestamp: "2024-01-15T10:30:00",
    },
    {
      id: "MSG-002",
      taskId: "TASK-001",
      author: "John Smith",
      content: "Yes, inspection is complete. The compressor needs replacement.",
      timestamp: "2024-01-15T11:00:00",
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-50 border-l-4 border-l-blue-500";
      case "flagged":
        return "bg-red-50 border-l-4 border-l-red-500";
      case "completed":
        return "bg-green-50 border-l-4 border-l-green-500";
      case "approved":
        return "bg-purple-50 border-l-4 border-l-purple-500";
      case "invoiced":
        return "bg-indigo-50 border-l-4 border-l-indigo-500";
      case "paid":
        return "bg-emerald-50 border-l-4 border-l-emerald-500";
      case "archived":
        return "bg-gray-50 border-l-4 border-l-gray-500";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "flagged":
        return <Flag className="h-4 w-4 text-red-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case "invoiced":
        return <TrendingUp className="h-4 w-4 text-indigo-600" />;
      case "paid":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedTask) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      taskId: selectedTask,
      author: "Current User",
      content: chatMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sheraton-cream to-background">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckSquare className="h-8 w-8 text-sheraton-gold mr-2" />
            <Badge className="bg-sheraton-gold text-sheraton-navy px-4 py-2">
              Task Management
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-sheraton-navy mb-4">
            Task Management System
          </h1>
          <p className="text-lg text-muted-foreground">
            Create, assign, and track tasks efficiently
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new-task" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Task
            </TabsTrigger>
            <TabsTrigger value="todo-list" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              To do List
            </TabsTrigger>
            <TabsTrigger value="live-chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          {/* New Task Tab */}
          <TabsContent value="new-task" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-sheraton-gold" />
                  Create New Task
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Create a task and assign it to internal staff or external vendors
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form Section */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Task Title *</Label>
                      <Input
                        id="task-title"
                        placeholder="e.g., Fix HVAC System"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-desc">Description</Label>
                      <Textarea
                        id="task-desc"
                        placeholder="Detailed task description..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Priority *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Assignment Type *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">Internal Staff</SelectItem>
                            <SelectItem value="external">External Vendor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Assign To *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal-1">John Smith - Maintenance</SelectItem>
                            <SelectItem value="internal-2">Sarah Johnson - Housekeeping</SelectItem>
                            <SelectItem value="external-1">ABC Plumbing - Plumbing</SelectItem>
                            <SelectItem value="external-2">XYZ Electric - Electrical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Due Date *</Label>
                        <Input type="date" />
                      </div>

                      <div className="space-y-2">
                        <Label>Estimated Time</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30 min">30 minutes</SelectItem>
                            <SelectItem value="1 hour">1 hour</SelectItem>
                            <SelectItem value="2 hours">2 hours</SelectItem>
                            <SelectItem value="4 hours">4 hours</SelectItem>
                            <SelectItem value="8 hours">8 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Terms (for external vendors)</Label>
                      <Input placeholder="e.g., 50% upfront, balance upon completion" />
                    </div>

                    <div className="space-y-2">
                      <Label>Attachments</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Drag and drop files here or click to upload
                        </p>
                      </div>
                    </div>

                    <Button className="w-full sheraton-gradient text-white">
                      <Send className="h-4 w-4 mr-2" />
                      Create & Send Task
                    </Button>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-base">Task Tips</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">
                            Clear Instructions
                          </p>
                          <p className="text-blue-700">
                            Provide detailed descriptions with expected outcomes
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">
                            Realistic Deadlines
                          </p>
                          <p className="text-blue-700">
                            Allow adequate time for quality work
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">
                            Payment Terms
                          </p>
                          <p className="text-blue-700">
                            Be clear about payment schedules for external work
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* To do List Tab */}
          <TabsContent value="todo-list" className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="invoiced">Invoiced</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tasks Display */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredTasks.map((task) => (
                <Card key={task.id} className={getStatusColor(task.status)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sheraton-navy">
                            {task.id}
                          </h3>
                          <p className="font-medium">{task.title}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>

                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="font-medium">{task.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due:</span>
                        <span className="font-medium">{task.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Time:</span>
                        <span className="font-medium">{task.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {task.status.replace("-", " ")}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task.id);
                          setActiveTab("live-chat");
                        }}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No tasks found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Live Chat Tab */}
          <TabsContent value="live-chat" className="space-y-6">
            {selectedTask ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Area */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>
                      Task: {tasks.find((t) => t.id === selectedTask)?.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto space-y-4">
                      {messages
                        .filter((m) => m.taskId === selectedTask)
                        .map((message) => (
                          <div key={message.id} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                {message.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded">
                              {message.content}
                            </p>
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSendMessage();
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="sheraton-gradient text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Task Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    {tasks.find((t) => t.id === selectedTask) && (
                      <>
                        <div>
                          <p className="text-muted-foreground">Title</p>
                          <p className="font-semibold">
                            {tasks.find((t) => t.id === selectedTask)?.title}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Priority</p>
                          <Badge
                            className={getPriorityColor(
                              tasks.find((t) => t.id === selectedTask)?.priority || ""
                            )}
                          >
                            {tasks.find((t) => t.id === selectedTask)?.priority}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Assigned To</p>
                          <p className="font-semibold">
                            {
                              tasks.find((t) => t.id === selectedTask)
                                ?.assignedTo
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-semibold">
                            {tasks.find((t) => t.id === selectedTask)?.dueDate}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Select a task to view chat
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click "Chat" on any task from the To do List
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;

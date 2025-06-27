import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ChatInterface } from "./components/chat/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Authenticated>
        <ChatInterface />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col bg-background">
          <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-border shadow-sm px-4">
            <h2 className="text-xl font-semibold text-foreground">
              Closed Beta Testing
            </h2>
          </header>
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <Content />
            </div>
          </main>
        </div>
      </Unauthenticated>
      <Toaster theme="dark" />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold text-foreground mb-4">
          Rafiqi
        </CardTitle>
        <CardDescription className="text-xl text-muted-foreground">
          Sign in to start chatting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}

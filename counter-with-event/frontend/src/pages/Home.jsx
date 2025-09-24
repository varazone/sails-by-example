import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bug,
  Check,
  Code,
  Copy,
  ExternalLink,
  Globe,
  Hash,
  MessageSquare,
  Network,
} from "lucide-react";
import { useWallet } from "../contexts/WalletContext";
import Footer from "../components/Footer";

const CodeBlock = ({ command, description }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-base-200 px-4 py-3 rounded-lg border border-base-300">
        <code className="text-sm font-mono flex-1">{command}</code>
        <button
          onClick={copyToClipboard}
          className="ml-3 p-2 rounded hover:bg-base-300 transition-colors"
          title="Copy to clipboard"
        >
          {copied
            ? <Check size={16} className="text-success" />
            : <Copy size={16} className="text-base-content/60" />}
        </button>
      </div>
      {description && (
        <span className="text-xs text-base-content/60 mt-1 block">
          {description}
        </span>
      )}
    </div>
  );
};

const Home = () => {
  const { selectedAccount } = useWallet();

  const scrollToGettingStarted = (e) => {
    e.preventDefault();
    const element = document.getElementById("getting-started");
    if (element) {
      const navbarHeight = 64; // Adjust this based on your navbar height
      const elementPosition = element.getBoundingClientRect().top +
        window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-base-100 via-base-200 to-base-300 mx-auto px-4 pt-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center gap-3 mb-6">
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full">
            <span className="text-primary font-semibold text-sm">
              Developer Toolkit
            </span>
          </div>
          <div className="inline-block bg-secondary/10 px-4 py-2 rounded-full">
            <span className="text-secondary font-semibold text-sm">
              Frontend Template
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text">
          Scaffold-Sails
        </h1>

        <p className="text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
          Everything you need to build dApps on Vara Network.
        </p>

        {selectedAccount && (
          <div className="mt-8 inline-flex items-center gap-3 bg-base-200/50 px-4 py-3 rounded-lg border border-base-300">
            <Network size={18} className="text-success" />
            <span className="text-sm font-medium">Connected to:</span>
            <code className="text-xs font-mono bg-base-300 px-2 py-1 rounded">
              {selectedAccount.address.slice(0, 12)}...{selectedAccount
                .address
                .slice(-8)}
            </code>
          </div>
        )}
      </div>

      {/* Features Grid - Asymmetrical Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Chat Card - Medium emphasis */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-info/10 p-3 rounded-xl">
              <MessageSquare className="h-8 w-8 text-info" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                <Link
                  to="/chat"
                  className="hover:text-primary transition-colors"
                >
                  AI Assistant
                </Link>
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed">
                Get help with your code, debug issues, or explore new ideas with
                our intelligent chat assistant.
              </p>
            </div>
          </div>
        </div>

        {/* Counter Program - Medium emphasis */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-success/10 p-3 rounded-xl">
              <Hash className="h-8 w-8 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                <Link
                  to="/counter"
                  className="hover:text-primary transition-colors"
                >
                  Counter Program
                </Link>
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed">
                A simple counter application demonstrating basic state
                management and interaction patterns.
              </p>
            </div>
          </div>
        </div>

        {/* DNS Program - Medium emphasis */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-warning/10 p-3 rounded-xl">
              <Globe className="h-8 w-8 text-warning" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                <Link
                  to="/dns"
                  className="hover:text-primary transition-colors"
                >
                  DNS Program
                </Link>
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed">
                Domain name system example showing decentralized naming
                resolution.
              </p>
            </div>
          </div>
        </div>

        {/* Debug Card - Medium emphasis */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-error/10 p-3 rounded-xl">
              <Bug className="h-8 w-8 text-error" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                <Link
                  to="/debug"
                  className="hover:text-primary transition-colors"
                >
                  Debug Console
                </Link>
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed">
                Real-time network monitoring and debugging tools to track your
                application's performance and connectivity.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start - Call to action */}
        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-primary/20 p-3 rounded-xl">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Build?</h3>
              <p className="text-base-content/70 text-sm mb-4">
                Start exploring our examples or dive into the documentation to
                begin building your own decentralized applications.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={scrollToGettingStarted}
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </button>
                <a
                  href="https://github.com/varazone/scaffold-sails/wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm flex items-center gap-1"
                >
                  Read Documentation
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div
        id="getting-started"
        className="max-w-3xl mx-auto mt-20 pt-16 -mt-16"
      >
        <h2
          className="text-3xl font-bold mb-8 text-center cursor-pointer hover:text-primary transition-colors"
          onClick={scrollToGettingStarted}
        >
          Getting Started
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              📋 Clone Repository
            </h3>
            <div className="space-y-3">
              <CodeBlock command="git clone https://github.com/varazone/scaffold-sails && cd scaffold-sails" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              📦 Install Dependencies
            </h3>
            <div className="space-y-3">
              <CodeBlock command="bun install" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              🚀 Start Development
            </h3>
            <div className="space-y-3">
              <CodeBlock
                command="bun run dev"
                description="Start development server"
              />
              <CodeBlock
                command="bun run build"
                description="Build for production"
              />
              <CodeBlock
                command="bun run lint"
                description="Run code linting"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-info/10 rounded-lg border border-info/20">
          <p className="text-sm text-info-content">
            <strong>💡 Pro tip:</strong>{" "}
            Use the Debug Console to monitor your application's network status
            and performance while developing.
          </p>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Home;

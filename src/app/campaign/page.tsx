"use client";

import { CampaignForm } from "@/components/campaign-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CampaignPage() {
  return (
    <div className="max-w-2xl pt-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] no-underline mb-6 transition-colors"
      >
        <ArrowLeft size={13} />
        Dashboard
      </Link>

      <div className="mb-8 animate-fade-up">
        <h1
          className="text-[42px] leading-tight mb-1.5 text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          New Campaign
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Upload leads and launch an AI calling campaign
        </p>
      </div>

      <div className="card p-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <CampaignForm />
      </div>
    </div>
  );
}

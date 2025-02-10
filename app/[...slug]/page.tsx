import { Metadata } from "next";
import { JobsLayout } from "@/components/JobsLayout";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
export const runtime = "edge";
interface PageProps {
  params: {
    slug: string[];
  };
  searchParams: { q?: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { title, location, experience } = parseSlug(params.slug);

  return {
    title: `${experience ? `${experience} ` : ""}${
      title ? `${title} ` : ""
    }Remote Jobs${location ? ` in ${location}` : ""} | TechNomads`,
    description: `Find ${experience ? `${experience} ` : ""}remote ${
      title || ""
    } jobs${
      location ? ` in ${location}` : ""
    }. Work from anywhere with top companies.`,
  };
}

function parseSlug(slug: string[]): {
  title?: string;
  location?: string;
  experience?: string;
} {
  const fullSlug = slug.join("-");

  // Pattern for experience level only (new pattern)
  if (fullSlug.match(/^(senior|entry-level|mid-level)-remote-jobs$/)) {
    const [_, experience] = fullSlug.match(
      /^(senior|entry-level|mid-level)-remote-jobs$/
    )!;
    return { experience };
  }

  // Pattern for experience + title + location
  if (
    fullSlug.match(
      /^(senior|entry-level|mid-level)-remote-([^-]+)-jobs-in-(.+)$/
    )
  ) {
    const [_, experience, title, locationSlug] = fullSlug.match(
      /^(senior|entry-level|mid-level)-remote-([^-]+)-jobs-in-(.+)$/
    )!;
    const locationOption = jobLocationOptions.find(
      (option) => option.slug === locationSlug
    );
    return {
      experience,
      title,
      location: locationOption?.value || locationSlug,
    };
  }

  // Pattern matching for different URL formats
  if (fullSlug.match(/^(senior|entry-level|mid-level)-remote-(.+)-jobs$/)) {
    const [_, experience, title] = fullSlug.match(
      /^(senior|entry-level|mid-level)-remote-(.+)-jobs$/
    )!;
    return { experience, title };
  }

  // Add new pattern for experience + title + location combination
  if (
    fullSlug.match(/^(senior|entry-level|mid-level)-remote-(.+)-jobs-in-(.+)$/)
  ) {
    const [_, experience, title, locationSlug] = fullSlug.match(
      /^(senior|entry-level|mid-level)-remote-(.+)-jobs-in-(.+)$/
    )!;
    const locationOption = jobLocationOptions.find(
      (option) => option.slug === locationSlug
    );
    return {
      experience,
      title,
      location: locationOption?.value || locationSlug,
    };
  }

  if (fullSlug.match(/^remote-(.+)-jobs-in-(.+)$/)) {
    const [_, title, locationSlug] = fullSlug.match(
      /^remote-(.+)-jobs-in-(.+)$/
    )!;
    // Find the location option that matches the slug
    const locationOption = jobLocationOptions.find(
      (option) => option.slug === locationSlug
    );
    return {
      title,
      location: locationOption?.value || "", // Use value instead of slug
    };
  }

  if (fullSlug.match(/^remote-(.+)-jobs$/)) {
    const [_, title] = fullSlug.match(/^remote-(.+)-jobs$/)!;
    return { title };
  }

  if (fullSlug.match(/^remote-jobs-in-(.+)$/)) {
    const [_, locationSlug] = fullSlug.match(/^remote-jobs-in-(.+)$/)!;
    // Find the location option that matches the slug - same as above
    const locationOption = jobLocationOptions.find(
      (option) => option.slug === locationSlug
    );
    return {
      location: locationOption?.value || locationSlug,
    };
  }
  return {};
}

export default function JobsPage({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { q?: string };
}) {
  const { title, location, experience } = parseSlug(params.slug);

  return (
    <JobsLayout
      initialTitle={title}
      initialLocation={location}
      initialExperience={experience}
      initialKeywords={searchParams.q || ""}
    />
  );
}

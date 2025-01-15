import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-4">
          The job you are looking for could not be found.
        </p>
        <Link href="/jobs" className="text-blue-600 hover:underline">
          Browse All Jobs
        </Link>
      </div>
    </div>
  );
}

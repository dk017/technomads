import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category, page, sort, jobTitle, techStack } = req.query;

  // Fetch or filter jobs based on the query parameters
  const jobs = [
    // Example job data
    { id: 1, title: 'Software Engineer', company: 'TechCorp', location: 'Remote' },
    // Add more jobs as needed
  ];

  // Filter jobs based on the query parameters
//   const filteredJobs = jobs.filter(job => {
//     return (
//       (!jobTitle || job.title.includes(jobTitle as string)) &&
//       (!techStack))
//     );
//   });

//   res.status(200).json(filteredJobs);
// }

}
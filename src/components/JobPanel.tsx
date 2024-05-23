import { Link } from "react-router-dom";
import { Job } from "../types";
import { formatSalary } from "../utils";

const JobListItem: React.FC<{ job: Job }> = ({ job }) => {
  const salaryFormatted =
    formatSalary(job.salaryFrom) + " - " + formatSalary(job.salaryTo);

  return (
    <Link
      to={`jobs/${job.id}`}
      className="flex h-40 items-center justify-between border-b-2 border-gray-400 bg-gray-50 px-4 text-gray-800 hover:bg-gray-200"
    >
      <span>
        <p className="text-xl">{job.company}</p>
        <p className="text-lg font-semibold">{job.position}</p>
        <p className="text-md underline">{job.city}</p>
      </span>
      <span>
        <p className="text-lg font-semibold">{salaryFormatted}</p>
        <p className="float-end text-sm">{job.type}</p>
      </span>
    </Link>
  );
};

export default JobListItem;

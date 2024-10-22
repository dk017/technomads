import React from "react";

interface Description {
  [key: string]: string[];
}

interface FormattedJobDescriptionProps {
  description: Description;
}

const FormattedJobDescription: React.FC<FormattedJobDescriptionProps> = ({
  description,
}) => {
  if (!description || Object.keys(description).length === 0) {
    return <div>No description available.</div>;
  }

  const sortedSections = Object.entries(description).sort(([a], [b]) => {
    const order = [
      "Position Summary",
      "Responsibilities",
      "Skills and Qualifications",
    ];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div>
      {sortedSections.map(([title, content], index) => (
        <div key={index}>
          <h3>{title}</h3>
          <ul>
            {content.map((item, itemIndex) => (
              <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FormattedJobDescription;

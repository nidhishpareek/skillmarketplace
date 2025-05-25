import React from "react";
import SkillCard from "./SkillCard";

const SkillListing = ({ skills, onEdit }: any) => {
  return (
    <div>
      {skills.map((skill: any) => (
        <SkillCard key={skill.id} skill={skill} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default SkillListing;

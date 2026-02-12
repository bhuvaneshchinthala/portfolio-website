/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectTitle?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  detailedCaseStudy?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  projectThumbnail?: string;
  /** @wixFieldType text */
  techStackTags?: string;
  /** @wixFieldType url */
  liveUrl?: string;
  /** @wixFieldType url */
  gitHubUrl?: string;
}


/**
 * Collection ID: skills
 * Interface for Skills
 */
export interface Skills {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  skillName?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType number */
  proficiencyLevel?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  icon?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType url */
  documentationUrl?: string;
}

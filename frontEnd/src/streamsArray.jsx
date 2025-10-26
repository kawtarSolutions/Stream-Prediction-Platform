 import electrical from "./images/electrical_engineering.jpg"
 import biomedical from "./images/biomedical_engineering.jpg"
 import material from "./images/material_engineering.jpg"
 import aeronautical from "./images/aeronautical_engineering.jpg"
 import mechanical from "./images/mechanical_engineering.jpg"
 import data from "./images/data_engineering.jpg"
 import energetic from "./images/energetic_engineering.jpg"
 
 const streams = [
  {
    id: 1,
    title: "Electrical Engineering and Digital Industries",
    description: "Trains engineers in embedded systems, smart grids, and IoT, combining digital and energy system expertise. Prepares graduates to automate industrial systems, optimize renewable energy, and support digital transformation in industry and energy sectors.",
    jobs: [
      "Production Engineer",
      "R&D Engineer",
      "Project Manager",
      "Technical Consultant",
      "Startup Founder / Entrepreneur"
    ],
    url: electrical
  },
  {
    id: 2,
    title: "Biomedical Engineering",
    description: "Prepares engineers with both technical engineering skills and knowledge of the medical field, enabling them to design, maintain, and manage medical devices and hospital biomedical services, and provide solutions in biomedical engineering.",
    jobs: [
      "R&D Engineer",
      "Biomedical Service Manager",
      "Maintenance & Technical Support Engineer",
      "Engineering Consultant / Design Office Engineer",
      "Quality, Safety, and Environmental Engineer"
    ],
    url: biomedical
  },
  {
    id:3,
    title: "Materials Engineering and Quality",
    description: "Focuses on understanding and applying the properties of metals, polymers, ceramics, and composites, while integrating environmental and quality management systems to improve industrial performance and sustainability.",
    jobs: [
      "Production Engineer",
      "Design Office / Engineering Consultant",
      "Maintenance Engineer",
      "Quality, Safety, and Environmental Manager",
      "R&D Engineer",
      "Technical Support Engineer"
    ],
    url: material
  },
  {
    id: 4,
    title: "Mechanical Engineering",
    description: "Trains engineers in industrial design, production processes, mechanical modeling and simulation, automation of industrial systems, and project and business management.",
    jobs: [
      "Mechanical Engineer",
      "Industrial Design Engineer",
      "Manufacturing / Process Engineer",
      "Industrial Maintenance Engineer",
      "Automation Systems Engineer"
    ],
    url: mechanical
  },
  {
    id: 5,
    title: "Automotive and Aeronautical Engineering",
    description: "Prepares engineers to design, test, manufacture, maintain, and market vehicles and aircraft (including drones and helicopters). Emphasizes engineering tools, project management, and hands-on experience via internships.",
    jobs: [
      "Design Engineer",
      "Production Support Engineer",
      "Production Manager",
      "Maintenance Engineer",
      "Administrative Support Engineer",
      "Technical Sales Engineer"
    ],
    url: aeronautical
  },
  {
    id: 6,
    title: "Digital Engineering in Data Science, AI & Digital Health",
    description: "Trains engineers to develop digital solutions for healthcare and other sectors using data science, Big Data, and AI. Focuses on project management, analytics, visualization, and digital transformation within healthcare systems.",
    jobs: [
      "Healthcare Technology Decision-Maker",
      "e-Health Engineer",
      "Data Scientist",
      "Data Engineer",
      "Data Officer",
      "Healthcare IT Project Manager",
      "Big Data Developer",
      "AI Engineer",
      "Digital Transformation Engineer",
      "Analytics & Visualization Consultant",
      "Digital Solutions Integrator",
      "Business Intelligence Consultant"
    ],
    url: data
  },
  {
    id: 7,
    title: "Energy Systems and Environmental Engineering",
    description: "Prepares engineers to manage energy production and distribution, optimize energy efficiency, design solar, wind, and thermal systems, conduct energy audits, and evaluate technological innovations in the international energy market.",
    jobs: [
      "Energy Production & Management Engineer",
      "HVAC Engineer",
      "Energy & Environment Engineer",
      "Hydraulics & Sanitation Design Engineer",
      "Energy Auditor",
      "Energy Sales Engineer",
      "Thermal Systems Engineer",
      "Energy Efficiency Engineer"
    ],
    url: energetic
  }
];

export default streams;
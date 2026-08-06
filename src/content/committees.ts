/**
 * Conference committees.
 *
 * Every spelling, initial and designation below is transcribed from the
 * official conference poster. Verify each entry against an approved source
 * before the site is made public — names and designations are the most
 * frequently corrected content on an academic conference site.
 */

export type Member = {
  name: string;
  designation: string;
  institution: string;
};

export type CommitteeGroup = {
  id: string;
  title: string;
  /** Leadership groups show by default; the rest expand inline on the homepage. */
  leadership: boolean;
  members: Member[];
};

export const committees: CommitteeGroup[] = [
  {
    id: "chief-patrons",
    title: "Chief Patrons",
    leadership: true,
    members: [
      {
        name: "Prof. Vempaty Kutumba Sastry",
        designation: "Chancellor",
        institution: "SCSVMV",
      },
      {
        name: "Prof. G. Srinivasu",
        designation: "Vice-Chancellor",
        institution: "SCSVMV",
      },
      {
        name: "Prof. R. Vasanth Kumar Mehta",
        designation: "Pro Vice-Chancellor",
        institution: "SCSVMV",
      },
    ],
  },
  {
    id: "patrons",
    title: "Patrons",
    leadership: true,
    members: [
      {
        name: "Prof. G. Sriram",
        designation: "Registrar i/c",
        institution: "SCSVMV",
      },
      {
        name: "Prof. K. Rajasekaran",
        designation: "Registrar i/c",
        institution: "TNTEU",
      },
    ],
  },
  {
    id: "co-patron",
    title: "Co-Patron",
    leadership: true,
    members: [
      {
        name: "Dr. M. Kanmani",
        designation: "Dean and COE i/c",
        institution: "TNTEU",
      },
    ],
  },
  {
    id: "conference-chairs",
    title: "Conference Chairs",
    leadership: true,
    members: [
      {
        name: "Prof. K. Venkatramanan",
        designation:
          "Dean, Faculty of Science and Dean i/c, Faculty of Education",
        institution: "SCSVMV",
      },
      {
        name: "Prof. N. Ramakrishnan",
        designation: "Professor and Head, Department of Educational Technology",
        institution: "TNTEU",
      },
    ],
  },
  {
    id: "advisory-committee",
    title: "Advisory Committee",
    leadership: false,
    members: [
      {
        name: "Prof. M. Rathinakumar",
        designation: "Dean, Faculty of Engineering and Technology",
        institution: "SCSVMV",
      },
      {
        name: "Prof. B. Balaji Srinivasan",
        designation: "Dean, Faculty of Management Studies",
        institution: "SCSVMV",
      },
      {
        name: "Prof. K. Nirmala Kumari",
        designation: "Dean, Faculty of Law",
        institution: "SCSVMV",
      },
      {
        name: "Prof. Dr. N. Panchanatham",
        designation: "Vice-Chancellor",
        institution: "GRI, Dindigul",
      },
      {
        name: "Prof. Dr. KVSN Murthy",
        designation: "Dean and HoD (Retd.), School of Education",
        institution: "SCSVMV",
      },
      {
        name: "Prof. Radhagovinda Tripathy",
        designation: "Professor",
        institution: "NSU, Tirupathi",
      },
      {
        name: "Prof. M. Govindan",
        designation: "Professor (Retd.)",
        institution: "TNTEU, Chennai",
      },
      {
        name: "Dr. N. Kalai Arasi",
        designation: "Associate Professor (Retd.)",
        institution: "NKT National College of Education for Women, Chennai",
      },
      {
        name: "Prof. R. Chandrasekhar",
        designation: "Professor, Department of Education",
        institution: "NSU, Tirupathi",
      },
      {
        name: "Prof. Surendar Kumar Sharma",
        designation: "Professor, Department of Education",
        institution: "HPU, Shimla",
      },
      {
        name: "Prof. Ravikanth",
        designation: "Professor, Department of Education",
        institution: "CUSB, Gaya",
      },
      {
        name: "Dr. K. Thiyagu",
        designation:
          "Associate Professor, Department of Education and Training",
        institution: "CUK, Kalaburagi",
      },
      {
        name: "Dr. Hariharan",
        designation: "Assistant Professor, Department of Education",
        institution: "IGNTU, Amarkantak",
      },
      {
        name: "Dr. T. Arun Christopher",
        designation: "Assistant Professor, Department of Education",
        institution: "CUK, Kashmir",
      },
      {
        name: "Prof. Yuvaraj Yashwant Pawar",
        designation: "Professor",
        institution: "PS College of Education, Maharashtra",
      },
    ],
  },
  {
    id: "organizing-secretaries",
    title: "Organizing Secretaries",
    leadership: false,
    members: [
      {
        name: "Mrs. J. Jayapriya",
        designation: "Assistant Professor and Head i/c, School of Education",
        institution: "SCSVMV",
      },
      {
        name: "Dr. R. Rajalakshmi",
        designation: "Assistant Professor",
        institution: "TNTEU",
      },
      {
        name: "Dr. P. N. Lakshmi Shanmugam",
        designation: "Assistant Professor",
        institution: "TNTEU",
      },
    ],
  },
  {
    id: "joint-organizing-secretaries",
    title: "Joint-Organizing Secretaries",
    leadership: false,
    members: [
      {
        name: "Dr. T. Sivasakthi Rajammal",
        designation: "Assistant Professor and Head",
        institution: "TNTEU",
      },
      {
        name: "Dr. V. Vasudevan",
        designation: "Assistant Professor",
        institution: "TNTEU",
      },
      {
        name: "Dr. S. Balamurugan",
        designation: "Assistant Professor",
        institution: "TNTEU",
      },
      {
        name: "Dr. K. Ratheeswari",
        designation: "Assistant Professor and Head",
        institution: "TNTEU",
      },
      {
        name: "Dr. V. Vijayakumar",
        designation: "Assistant Professor",
        institution: "TNTEU",
      },
    ],
  },
  {
    id: "organizing-committee",
    title: "Organizing Committee",
    leadership: false,
    members: [
      {
        name: "Mr. R. Saravanan",
        designation: "Assistant Professor",
        institution: "SCSVMV",
      },
      {
        name: "Dr. T. Sundararasan",
        designation: "Assistant Professor",
        institution: "SCSVMV",
      },
      {
        name: "Mrs. P. Bhuvaneswari",
        designation: "Assistant Professor",
        institution: "SCSVMV",
      },
      {
        name: "Dr. A. Gunalan",
        designation: "Assistant Director of Physical Education",
        institution: "SCSVMV",
      },
      {
        name: "Mr. V. N. Balasubramaniyam",
        designation: "Assistant Professor",
        institution: "SCSVMV",
      },
      {
        name: "Dr. S. R. Sainathan",
        designation: "JMO",
        institution: "SCSVMV",
      },
      {
        name: "Dr. A. Mathini",
        designation: "Assistant Professor and Head",
        institution: "SCSVMV",
      },
    ],
  },
];

export const leadershipGroups = committees.filter((g) => g.leadership);

export const totalCommitteeMembers = committees.reduce(
  (sum, group) => sum + group.members.length,
  0,
);

export interface Show {
  id: number;
  title: string;
  description: string;
}

export const SHOWS: Show[] = [
  {
    id: 1,
    title: "The Office",
    description:
      "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium",
  },
  {
    id: 2,
    title: "It's Always Sunny in Philadelphia",
    description:
      "Five friends with big egos and small brains are the proprietors of an Irish pub",
  },
];

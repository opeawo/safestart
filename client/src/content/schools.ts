// Seed pool of Nigerian schools for the typeahead. Per F5.5 the canonical
// list is server-managed; this is a static demo set so the UI works.
export const SEED_SCHOOLS: string[] = [
  "Kings College Lagos",
  "Queens College Yaba",
  "Loyola Jesuit College, Abuja",
  "Federal Government College, Ijanikin",
  "Federal Government College, Sokoto",
  "Federal Government Girls' College, Sagamu",
  "Corona Secondary School, Agbara",
  "Greensprings School, Lagos",
  "British International School, Lagos",
  "Day Waterman College, Abeokuta",
  "Atlantic Hall, Epe",
  "Lagoon Secondary School, Lekki",
  "Lifeforte International School, Ibadan",
  "International School Ibadan",
  "The American International School, Lagos",
  "Adesoye College, Offa",
  "Igbinedion Education Centre, Benin",
  "Christ the King College, Onitsha",
  "Holy Child College, Lagos",
  "Mayflower School, Ikenne",
  "Government College, Umuahia",
  "Government College, Kaduna",
  "Government Secondary School, Wuse",
  "Air Force Secondary School, Jos",
  "Command Day Secondary School, Lagos",
  "Olashore International School, Iloko-Ijesa",
  "Whiteplains British School, Abuja",
  "Charisma International Schools, Port Harcourt",
  "Vivian Fowler Memorial College, Lagos",
  "Grange School, Ikeja",
];

export function searchSchools(q: string, custom: string[] = []): string[] {
  const all = [...SEED_SCHOOLS, ...custom];
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const nq = norm(q.trim());
  if (!nq) return [];
  // Score by: prefix match > word-prefix match > contains
  const scored = all
    .map((s) => {
      const ns = norm(s);
      let score = -1;
      if (ns.startsWith(nq)) score = 3;
      else if (ns.split(" ").some((w) => w.startsWith(nq))) score = 2;
      else if (ns.includes(nq)) score = 1;
      return { s, score };
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.s.localeCompare(b.s))
    .slice(0, 8);
  return scored.map((x) => x.s);
}

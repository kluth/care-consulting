import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const template = await prisma.auditTemplate.create({
    data: {
      title: 'MDK-Prüfung Ambulant 2025',
      type: 'AMBULANT',
      sections: {
        create: [
          {
            title: '1. Pflegerische Leistungen',
            order: 1,
            questions: {
              create: [
                {
                  text: 'Wird die Körperpflege entsprechend den Bedürfnissen durchgeführt?',
                  points: 10,
                  isKoCriteria: true,
                },
                { text: 'Liegt eine Wunddokumentation vor?', points: 10, isKoCriteria: true },
                { text: 'Werden Medikamente sicher gelagert?', points: 5 },
              ],
            },
          },
          {
            title: '2. Ärztlich verordnete Leistungen',
            order: 2,
            questions: {
              create: [
                {
                  text: 'Werden Injektionen hygienisch einwandfrei durchgeführt?',
                  points: 10,
                  isKoCriteria: true,
                },
                { text: 'Ist der Medikamentenplan aktuell?', points: 10 },
              ],
            },
          },
          {
            title: '3. Dienstleistung und Organisation',
            order: 3,
            questions: {
              create: [
                { text: 'Gibt es ein Beschwerdemanagement?', points: 5 },
                { text: 'Sind die Mitarbeiter fortgebildet?', points: 5 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Created Audit Template:', template.id);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

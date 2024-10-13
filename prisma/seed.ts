const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function loadJSON(filePath: string) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function main() {
  const levels = await loadJSON(path.join(__dirname, 'seeds', 'levels.json'));
  const modules = await loadJSON(path.join(__dirname, 'seeds', 'modules.json'));
  const lessonsModules = await loadJSON(path.join(__dirname, 'seeds', 'lessons_modules.json'));
  const questionsModule1Lesson1 = await loadJSON(path.join(__dirname, 'seeds', 'questions_module_1_lesson_1.json'));
  const questionsModule9Lesson5 = await loadJSON(path.join(__dirname, 'seeds', 'questions_module_9_lesson_5.json'));
  const questionsModule9Lesson8 = await loadJSON(path.join(__dirname, 'seeds', 'questions_module_9_lesson_8.json'));

  // // Seed Levels
  // for (const level of levels) {
  //   await prisma.level.create({ data: level });
  // }

  // // Seed Modules
  // for (const moduleData of modules) {
  //   await prisma.module.create({ data: moduleData });
  // }

  // // Seed Lessons
  // for (const lesson of lessonsModules) {
  //   await prisma.lesson.create({ data: lesson });
  // }

  // // Seed Questions and Answers for Module 1 Lesson 1
  // for (const questionData of questionsModule1Lesson1) {
  //   const { answers, ...question } = questionData;
  //   const createdQuestion = await prisma.question.create({
  //     data: question
  //   });
  //   for (const answer of answers) {
  //     await prisma.answer.create({
  //       data: {
  //         ...answer,
  //         questionId: createdQuestion.id
  //       }
  //     });
  //   }
  // }

  // Seed Questions and Answers for Module 9 Lesson 8
  for (const questionData of questionsModule9Lesson8) {
    const { answers, ...question } = questionData;
    const createdQuestion = await prisma.question.create({
      data: question
    });
    for (const answer of answers) {
      await prisma.answer.create({
        data: {
          ...answer,
          questionId: createdQuestion.id
        }
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

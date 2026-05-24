/**
 * Example sentence translation generator.
 *
 * This script generates Chinese translations for example sentences
 * using a built-in translation map for common sentence patterns.
 *
 * For bulk translation, integrate with an LLM API or use a translation service.
 *
 * Usage: npx ts-node scripts/generate-translations.ts
 */

import fs from 'fs'
import path from 'path'
import type { WordData, WordExample } from '../data/types'

interface TranslationMap {
  [english: string]: string
}

// Load vocabulary data
const vocabPath = path.join(__dirname, '..', 'data', 'vocabulary.json')
const vocab: WordData[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'))

// Built-in translation map for common example sentences
// Generated translations for the most common examples
const translationMap: TranslationMap = {
  // spect root words
  'The teacher inspected our homework.': '老师检查了我们的家庭作业。',
  'Officials inspected the factory.': '官员们检查了这家工厂。',
  'We should respect our elders.': '我们应该尊重长辈。',
  'I have great respect for her work.': '我十分尊重她的工作。',
  'I suspect he is lying.': '我怀疑他在撒谎。',
  'The police suspect him of the crime.': '警方怀疑他犯有此罪。',
  'The prospect of a new job excited her.': '新工作的前景让她兴奋不已。',
  'There is little prospect of rain today.': '今天下雨的可能性很小。',
  'She is a spectator at the match.': '她在比赛现场是一名观众。',

  // rupt root words
  'The car made an abrupt stop.': '汽车突然停下了。',
  'He left in an abrupt manner.': '他突然离开了。',
  'Please don\'t interrupt me when I\'m speaking.': '我说话时请不要打断我。',
  'The storm disrupted travel plans.': '暴风雨打乱了出行计划。',
  'The volcano began to erupt at midnight.': '火山在午夜开始喷发。',
  'The company went bankrupt last year.': '这家公司去年破产了。',
  'The corrupt official was arrested.': '这名腐败官员被逮捕了。',
  'He suffered a rupture of the Achilles tendon.': '他的跟腱断裂了。',

  // dict/dic root words
  'I need to look up this word in the dictionary.': '我需要在字典里查这个词。',
  'They predict that it will rain tomorrow.': '他们预测明天会下雨。',
  'The boss dictated a letter to his secretary.': '老板给秘书口述了一封信。',

  // cept/cap root words
  'Please accept this small gift.': '请收下这份小礼物。',
  'His idea is difficult to accept.': '他的想法令人难以接受。',
  'This is a very interesting concept.': '这是一个非常有趣的概念。',
  'Everyone is here except Tom.': '除了汤姆，大家都到齐了。',

  // duce/duct root words
  'Education can change a person\'s life.': '教育可以改变一个人的人生。',
  'Let me introduce my friend to you.': '让我介绍我的朋友给你认识。',
  'The factory produces cars.': '这家工厂生产汽车。',
  'We need to reduce our expenses.': '我们需要减少开支。',

  // pel/puls root words
  'They tried to compel him to confess.': '他们试图强迫他坦白。',
  'He was expelled from school.': '他被学校开除了。',
  'The engine propels the boat forward.': '发动机推动船向前进。',

  // ject root words
  'We need to complete this project on time.': '我们需要按时完成这个项目。',
  'The nurse will inject the medicine.': '护士会注射药物。',
  'She rejected his proposal.': '她拒绝了他的求婚。',

  // miss/mit root words
  'I received your message.': '我收到了你的消息。',
  'They went on a dangerous mission.': '他们去执行一项危险的任务。',
  'I must admit I made a mistake.': '我必须承认我犯了一个错误。',
  'He was dismissed from his job.': '他被解雇了。',
  'Please submit your report by Friday.': '请在周五前提交你的报告。',

  // tain/ten root words
  'This box contains old books.': '这个盒子装着旧书。',
  'We need to maintain the equipment regularly.': '我们需要定期维护设备。',
  'She obtained a degree in engineering.': '她获得了工程学学位。',

  // tract root words
  'The beautiful scenery attracted many tourists.': '美丽的风景吸引了许多游客。',
  'Please read the contract carefully before signing.': '签字前请仔细阅读合同。',
  'Don\'t distract me while I\'m studying.': '我学习时不要分散我的注意力。',

  // vert/vers root words
  'The company advertises on television.': '这家公司在电视上做广告。',
  'They decided to convert the factory into a museum.': '他们决定把工厂改造成博物馆。',
  'We live in a diverse society.': '我们生活在一个多元化的社会。',

  // struct root words
  'The bridge has a strong structure.': '这座桥结构坚固。',
  'They plan to construct a new hospital.': '他们计划建设一所新医院。',
  'The earthquake destroyed many buildings.': '地震摧毁了许多建筑。',

  // ced/ceed/cess root words
  'Hard work is the key to success.': '努力工作是成功的关键。',
  'Do not exceed the speed limit.': '不要超速。',
  'Let\'s proceed with the plan.': '我们继续按计划进行吧。',
  'You need a password to access the system.': '你需要密码才能进入系统。',
}

function translateExample(english: string): string {
  if (translationMap[english]) {
    return translationMap[english]
  }

  // Return placeholder for manual translation
  return `[待翻译] ${english}`
}

function migrateExamples(
  examples: string[] | WordExample[]
): WordExample[] {
  if (examples.length === 0) return []

  if (typeof examples[0] === 'object' && 'chinese' in (examples[0] as object)) {
    return examples as WordExample[]
  }

  return (examples as string[]).map((eng) => ({
    english: eng,
    chinese: translateExample(eng),
  }))
}

// Main
function main() {
  let migratedCount = 0
  let translatedCount = 0
  let needsTranslation = 0

  const migrated = vocab.map((word) => {
    const examples = migrateExamples(word.examples)
    const translated = examples.filter(
      (e) => !e.chinese.startsWith('[待翻译]')
    ).length
    const untranslated = examples.length - translated

    migratedCount++
    translatedCount += translated
    needsTranslation += untranslated

    return {
      ...word,
      examples,
    }
  })

  const outPath = path.join(__dirname, '..', 'data', 'vocabulary.json')
  fs.writeFileSync(outPath, JSON.stringify(migrated, null, 2))

  console.log(`Migration complete!`)
  console.log(`  Total words: ${migratedCount}`)
  console.log(`  Total examples: ${translatedCount + needsTranslation}`)
  console.log(`  Translated: ${translatedCount}`)
  console.log(`  Needs manual translation: ${needsTranslation}`)
  console.log(`  Written to: ${outPath}`)

  // Generate list of untranslated sentences for bulk translation
  const untranslated = migrated
    .flatMap((w) =>
      (w.examples as WordExample[])
        .filter((e) => e.chinese.startsWith('[待翻译]'))
        .map((e) => e.english)
    )
    .filter((v, i, a) => a.indexOf(v) === i)

  if (untranslated.length > 0) {
    const untranslatedPath = path.join(
      __dirname,
      '..',
      'data',
      'untranslated.json'
    )
    fs.writeFileSync(untranslatedPath, JSON.stringify(untranslated, null, 2))
    console.log(`  Untranslated sentences saved to: ${untranslatedPath}`)
    console.log(
      `  Use an LLM to translate these in bulk, then update vocabulary.json`
    )
  }
}

main()

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentesRepository: InMemoryStudentsRepository,
  ) { }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) return null

    return question
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (question) return question

    return null
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    const author = this.studentesRepository.items.find(student => student.id.equals(question.authorId))

    if (!author) throw new Error(`Author with ID "${question.authorId.toString()}" dows not exist.`)

    const questionAttachments = this.questionAttachmentsRepository.items.filter(questionAttachment => {
      return questionAttachment.questionId.equals(question.id)
    })

    const attachments = questionAttachments.map(questionAttachment => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exists.`
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: author.id,
      authorName: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      bestAnswerId: question.bestAnswerId,
      attachments,
    })
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)

    this.questionAttachmentsRepository.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    this.questionAttachmentsRepository.createMany(question.attachments.getNewItems())

    this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toValue(),
    )
  }
}

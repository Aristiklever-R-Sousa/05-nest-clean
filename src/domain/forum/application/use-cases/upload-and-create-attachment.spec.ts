import { RegisterStudentUseCase } from './register-student'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
    beforeEach(() => {
        inMemoryAttachmentsRepository =
            new InMemoryAttachmentsRepository()
        fakeUploader = new FakeUploader()

        sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader)
    })

    it('should to be able to upload and create an attachment', async () => {
        const result = await sut.execute({
            fileName: 'sample-upload.png',
            fileType: 'image/png',
            body: Buffer.from('')
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toEqual({
            attachment: inMemoryAttachmentsRepository.items[0],
        })
        expect(fakeUploader.uploads).toHaveLength(1)
        expect(fakeUploader.uploads[0]).toEqual(expect.objectContaining({
            fileName: 'sample-upload.png',
        }))
    })

    it('should not be able to upload and create an attachment with invalid file type', async () => {
        const result = await sut.execute({
            fileName: 'sample-upload.mp3',
            fileType: 'audio/mpeg',
            body: Buffer.from('')
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
        expect(fakeUploader.uploads).toHaveLength(0)
    })

})

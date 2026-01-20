import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";

interface CommentWithAuthorProps {
    commentId: UniqueEntityId
    commentContent: string
    authorId: UniqueEntityId
    authorName: string
    createdAt: Date
    updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
    get commentId() {
        return this.props.commentId
    }
    get commentContent() {
        return this.props.commentContent
    }
    get authorId() {
        return this.props.authorId
    }
    get authorName() {
        return this.props.authorName
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }

    static create(props: CommentWithAuthorProps) {
        return new CommentWithAuthor(props)
    }
}

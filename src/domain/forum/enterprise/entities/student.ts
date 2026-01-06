import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface StudentProps {
  name: string
  email: string
  password: string

  createdAt: Date
  updatedAt?: Date
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }
  get email() {
    return this.props.email
  }
  get password() {
    return this.props.password
  }

  static create(props: Optional<StudentProps, 'createdAt'>, id?: UniqueEntityId) {
    const student = new Student({
      ...props,
      createdAt: props.createdAt || new Date
    }, id)

    return student
  }
}

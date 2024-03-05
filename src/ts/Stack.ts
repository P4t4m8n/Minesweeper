export class Stack<T> {
    private storage: T[] = []

    // Adds an element to the top of the stack
    push(item: T): void {
        this.storage.push(item)
    }

    // Removes and returns the element at the top of the stack.
    // If the stack is empty, it returns null (or throws an error)
    pop(): T | null {
        return this.storage.pop() || null
    }

    // Returns the element at the top of the stack without removing it.
    // If the stack is empty, it returns null
    peek(): T | null {
        return this.storage.length > 0 ? this.storage[this.storage.length - 1] : null
    }

    // Checks if the stack is empty
    isEmpty(): boolean {
        return this.storage.length === 0
    }

    // Returns the number of elements in the stack
    size(): number {
        return this.storage.length
    }
}
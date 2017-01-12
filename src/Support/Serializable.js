export default class Serializable {
    /**
     * @return {string}
     */
    toString(): string {
        return this.constructor.name;
    }

    /**
     * @return {string}
     */
    toLocalString(): string {
        return this.toString();
    }

    /**
     * @return {string}
     */
    [Symbol.toStringTag](): string {
        return this.toString();
    }

    /**
     * @return {string}
     */
    [Symbol.toPrimitive](): string {
        return this.toString();
    }
}

import {
    Model,
    UpdateQuery,
    QueryOptions,
    FilterQuery,
    Types,
} from 'mongoose';

export abstract class BaseRepository<TDocument> {
    constructor(protected readonly model: Model<TDocument>) { }

    async create(
        document: Partial<TDocument>,
    ): Promise<TDocument> {
        const created = new this.model(document);
        return (await created.save()) as unknown as TDocument;
    }

    async findOne(
        filter: FilterQuery<TDocument>,
    ): Promise<TDocument | null> {
        return this.model.findOne(filter).exec();
    }

    async findById(id: string | Types.ObjectId): Promise<TDocument | null> {
        return this.model.findById(id).exec();
    }

    async findAll(
        filter: FilterQuery<TDocument> = {},
    ): Promise<TDocument[]> {
        return this.model.find(filter).exec();
    }

    async updateOne(
        filter: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options: QueryOptions = {},
    ): Promise<TDocument | null> {
        return this.model
            .findOneAndUpdate(filter, update, {
                returnDocument: 'after',
                ...options,
            })
            .exec();
    }

    async updateMany(
        filter: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        options: QueryOptions = {},
    ): Promise<void> {
        await this.model.updateMany(filter, update, options as any).exec();
    }

    async deleteOne(
        filter: FilterQuery<TDocument>,
    ): Promise<void> {
        await this.model.deleteOne(filter).exec();
    }

    async deleteMany(
        filter: FilterQuery<TDocument>,
    ): Promise<void> {
        await this.model.deleteMany(filter).exec();
    }

    async exists(
        filter: FilterQuery<TDocument>,
    ): Promise<boolean> {
        const result = await this.model.exists(filter).exec();
        return result !== null;
    }

    async count(
        filter: FilterQuery<TDocument> = {},
    ): Promise<number> {
        return this.model.countDocuments(filter).exec();
    }
}
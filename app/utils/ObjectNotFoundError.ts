export class ObjectNotFoundError extends Error{
    
    public constructor(msg: string) {
        super(msg);
        this.name = 'ObjectNotFoundError';
    }

}
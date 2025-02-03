import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Coffee } from './coffee.entity';

@Schema()
export class Flavor extends Document {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coffee' })
  coffees: Coffee[];
}

export const FlavorSchema = SchemaFactory.createForClass(Flavor);

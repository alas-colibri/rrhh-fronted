export interface EventModel {
  id: string;
  question: string;
  active: boolean;
}

export interface CreateEventDto extends Omit<EventModel, 'id'> {
}

export interface UpdateEventDto extends Partial<Omit<EventModel, 'id'>> {
}

export interface ReadEventDto extends Partial<EventModel> {
}

export interface SelectEventDto extends Partial<EventModel> {
}

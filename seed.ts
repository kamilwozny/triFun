import { db } from './db/db';
import {
  users,
  events,
  trainingData,
  trainingEvents,
  posts,
  comments,
  eventAttendees,
  checklists,
  checklistItems,
} from './db/schema';

async function seedDatabase() {
  const newUsers = await db
    .insert(users)
    .values([
      {
        email: 'john.doe@example.com',
        password: 'password123',
        username: 'johndoe',
        name: 'John',
        surname: 'Doe',
        country: 'USA',
        city: 'New York',
        bio: 'Bio of John Doe',
        age: 30,
        expierenceLevel: 'Intermediate',
      },
      {
        email: 'jane.doe@example.com',
        password: 'password123',
        username: 'janedoe',
        name: 'Jane',
        surname: 'Doe',
        country: 'USA',
        city: 'Los Angeles',
        bio: 'Bio of Jane Doe',
        age: 28,
        expierenceLevel: 'Expert',
      },
    ])
    .returning();

  const newEvents = await db
    .insert(events)
    .values([
      {
        name: 'Marathon',
        startOn: '2023-12-01',
        createdById: newUsers[0].id,
        description: 'A marathon event',
        country: 'USA',
        city: 'New York',
        address: '123 Main St',
        organization: 'Marathon Org',
        distance_swim: 0,
        distance_bike: 0,
        distance_run: 42,
        isPrivate: false,
        price: 100,
        status: 'live',
      },
      {
        name: 'Triathlon',
        startOn: '2023-11-01',
        createdById: newUsers[1].id,
        description: 'A triathlon event',
        country: 'USA',
        city: 'Los Angeles',
        address: '456 Elm St',
        organization: 'Triathlon Org',
        distance_swim: 1.5,
        distance_bike: 40,
        distance_run: 10,
        isPrivate: false,
        price: 150,
        status: 'live',
      },
    ])
    .returning();

  const newTrainingData = await db
    .insert(trainingData)
    .values([
      {
        athleteId: newUsers[0].id,
        postId: 'some-post-id-1',
        activityType: 'Running',
        distance: 10000,
        duration: 3600,
        caloriesBurned: 600,
        elevationGain: 100,
        avgPace: 360,
        avgHeartRate: 150,
        sourcePlatform: 'Strava',
        timestamp: '2023-10-01T10:00:00Z',
        location: 'Central Park',
      },
      {
        athleteId: newUsers[1].id,
        postId: 'some-post-id-2',
        activityType: 'Cycling',
        distance: 50000,
        duration: 7200,
        caloriesBurned: 1200,
        elevationGain: 500,
        avgPace: 240,
        avgHeartRate: 140,
        sourcePlatform: 'Garmin',
        timestamp: '2023-10-02T10:00:00Z',
        location: 'Santa Monica',
      },
    ])
    .returning();

  const newTrainingEvents = await db
    .insert(trainingEvents)
    .values([
      {
        description: 'Training for marathon',
        name: 'Marathon Training',
        location: 'Central Park',
        goalType: 'Distance',
        goalValue: 10000,
        date: '2023-10-01',
        createdBy: newUsers[0].id,
        createdAt: '2023-09-01T10:00:00Z',
      },
      {
        description: 'Training for triathlon',
        name: 'Triathlon Training',
        location: 'Santa Monica',
        goalType: 'Time',
        goalValue: 7200,
        date: '2023-10-02',
        createdBy: newUsers[1].id,
        createdAt: '2023-09-02T10:00:00Z',
      },
    ])
    .returning();

  const newPosts = await db
    .insert(posts)
    .values([
      {
        userId: newUsers[0].id,
        description: 'Completed a 10k run',
        location: 'Central Park',
        distance: 10000,
        time: 3600,
        avgHeartRate: 150,
        avgSpeed: 10,
        activityType: 'Running',
        platform: 'Strava',
        createdAt: '2023-10-01T10:00:00Z',
        updatedAt: '2023-10-01T10:00:00Z',
      },
      {
        userId: newUsers[1].id,
        description: 'Completed a 50k bike ride',
        location: 'Santa Monica',
        distance: 50000,
        time: 7200,
        avgHeartRate: 140,
        avgSpeed: 25,
        activityType: 'Cycling',
        platform: 'Garmin',
        createdAt: '2023-10-02T10:00:00Z',
        updatedAt: '2023-10-02T10:00:00Z',
      },
    ])
    .returning();

  const newComments = await db
    .insert(comments)
    .values([
      {
        postId: newPosts[0].id,
        userId: newUsers[1].id,
        content: 'Great job on the run!',
        createdAt: '2023-10-01T12:00:00Z',
      },
      {
        postId: newPosts[1].id,
        userId: newUsers[0].id,
        content: 'Awesome bike ride!',
        createdAt: '2023-10-02T12:00:00Z',
      },
    ])
    .returning();

  const newEventAttendees = await db
    .insert(eventAttendees)
    .values([
      {
        eventId: newEvents[0].id,
        attendeeId: newUsers[1].id,
      },
      {
        eventId: newEvents[1].id,
        attendeeId: newUsers[0].id,
      },
    ])
    .returning();

  const newChecklists = await db
    .insert(checklists)
    .values([
      {
        eventId: newEvents[0].id,
        userId: newUsers[0].id,
        eventStartDate: '2023-12-01',
      },
      {
        eventId: newEvents[1].id,
        userId: newUsers[1].id,
        eventStartDate: '2023-11-01',
      },
    ])
    .returning();

  const newChecklistItems = await db
    .insert(checklistItems)
    .values([
      {
        checklistId: newChecklists[0].id,
        name: 'Running Shoes',
        status: 'Pending',
        amount: 1,
      },
      {
        checklistId: newChecklists[1].id,
        name: 'Bike Helmet',
        status: 'Pending',
        amount: 1,
      },
    ])
    .returning();
}

seedDatabase().catch(console.error);

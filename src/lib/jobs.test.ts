import { describe, it, expect } from 'vitest';
import { filterJobs, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

/** Build a small job fixture with selectable department and location values. */
function makeJob(
  slug: string,
  postedDate: string,
  department = 'Technology',
  location = 'Remote',
): Job {
  return {
    slug,
    title: `Role ${slug}`,
    department,
    location,
    type: 'Full-time',
    remote: true,
    postedDate,
    summary: 'A role.',
  };
}

describe('filterJobs', () => {
  const jobs = [
    makeJob('technology-remote', '2027-01-01', 'Technology', 'Remote'),
    makeJob('technology-office', '2027-01-02', 'Technology', 'Woodinville'),
    makeJob('finance-office', '2027-01-03', 'Finance', 'Woodinville'),
  ];

  it('filters by department', () => {
    expect(filterJobs(jobs, { department: 'Technology' }).map((job) => job.slug)).toEqual([
      'technology-remote',
      'technology-office',
    ]);
  });

  it('filters by location', () => {
    expect(filterJobs(jobs, { location: 'Woodinville' }).map((job) => job.slug)).toEqual([
      'technology-office',
      'finance-office',
    ]);
  });

  it('combines department and location filters with AND', () => {
    expect(
      filterJobs(jobs, { department: 'Finance', location: 'Woodinville' }).map(
        (job) => job.slug,
      ),
    ).toEqual(['finance-office']);
  });

  it('returns all jobs when filters are reset', () => {
    expect(filterJobs(jobs, {}).map((job) => job.slug)).toEqual([
      'technology-remote',
      'technology-office',
      'finance-office',
    ]);
  });

  it('returns no jobs when the filters do not match', () => {
    expect(
      filterJobs(jobs, { department: 'Technology', location: 'Woodinville' }).map(
        (job) => job.slug,
      ),
    ).toEqual(['technology-office']);
    expect(filterJobs(jobs, { department: 'Finance', location: 'Remote' })).toEqual([]);
  });
});

describe('sortByNewest', () => {
  it('orders jobs by posted date, newest first', () => {
    const jobs = [
      makeJob('a', '2027-01-01'),
      makeJob('b', '2027-03-15'),
      makeJob('c', '2027-02-10'),
    ];
    expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
  });

  it('does not mutate the input array', () => {
    const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
    const original = jobs.map((j) => j.slug);
    sortByNewest(jobs);
    expect(jobs.map((j) => j.slug)).toEqual(original);
  });
});

describe('formatPostedDate', () => {
  it('formats an ISO date as a readable string', () => {
    expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
  });

  it('returns the raw value when the date is unparseable', () => {
    expect(formatPostedDate('not-a-date')).toBe('not-a-date');
  });
});

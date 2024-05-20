/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { SORT, SORT_KEY } from '../../../src/constants/search';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';
import { SearchPaginationAndSort, SearchSchema } from '../../../src/types/Search';
import { Search } from '../../../src/utils/search';

describe('Service -> Search', () => {
  let search_service: Search<any>;

  beforeEach(() => {
    search_service = new Search<any>();
  });

  describe('createQuery', () => {
    it('should return an empty query if no search criteria is provided', () => {
      const search: SearchSchema = {};
      const query = search_service.createQuery(search);

      expect(query).deep.equal({});
    });

    it('should create a valid query with search criteria', () => {
      const search: SearchSchema = {
        name: { eq: 'Test' },
        price: { gt: 10, lt: 100 }
      };

      const query = search_service.createQuery(search);

      expect(query).deep.equal({
        name: { $eq: 'Test' },
        price: { $gt: 10, $lt: 100 }
      });
    });

    it('should handle multiple operators for the same field', () => {
      const search: SearchSchema = {
        price: { gt: 10, lt: 100, eq: 50 }
      };

      const query = search_service.createQuery(search);

      expect(query).deep.equal({
        price: { $gt: 10, $lt: 100, $eq: 50 }
      });
    });
  });

  describe('createOptions', () => {
    it('should create valid search options', () => {
      const pagination_and_sort: SearchPaginationAndSort = {
        sort: 'asc',
        sort_by: 'name',
        page: 1,
        size: 10
      };

      const options = search_service.createOptions(pagination_and_sort);

      expect(options).deep.equal({
        sort: { name: SORT.asc },
        limit: 10,
        skip: 0
      });
    });

    it('should handle different sort orders', () => {
      const pagination_and_sort: SearchPaginationAndSort = {
        sort: SORT_KEY.DESC,
        sort_by: 'price',
        page: 2,
        size: 5
      };

      const options = search_service.createOptions(pagination_and_sort);

      expect(options).deep.equal({
        sort: { price: SORT.desc },
        limit: 5,
        skip: 5
      });
    });
  });

  describe('listInfo', () => {
    it('should return correct list information', () => {
      const list_info = search_service.listInfo({ count: 50, skip: 0, page: 1, size: 10 });

      expect(list_info).deep.equal({
        pages: 5,
        count: 50,
        page: 1
      });
    });

    it('should throw an error if the count is less than skip', () => {
      try {
        search_service.listInfo({ count: 5, skip: 10, page: 2, size: 5 });
        expect.fail('Should throws BadRequestError');
      } catch (error) {
        expect(error).deep.equal(new BadRequestError(CODE_MESSAGES.INVALID_PAGE));
      }
    });
  });
});

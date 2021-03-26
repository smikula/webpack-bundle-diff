import { processReasons } from '../../src/api/deriveBundleData/graph/processReasons';

const moduleIdToNameMap: any = new Map([
    [1, 'module1'],
    [2, 'module2'],
    [3, 'module3'],
]);

describe('processReasons', () => {
    it('maps module IDs to names', () => {
        // Arrange
        const reasons: any = [
            { moduleId: 1, type: 'test' },
            { moduleId: 2, type: 'test' },
            { moduleId: 3, type: 'test' },
        ];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1', 'module2', 'module3']);
    });

    it('identifies non-entry point modules', () => {
        // Arrange
        const reasons: any = [{ moduleId: 1, type: 'test' }];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result.entryType).toBeUndefined();
    });

    it('identifies entry point modules', () => {
        // Arrange
        const expectedEntryType = 'test entry';
        const reasons: any = [
            { moduleId: 1, type: expectedEntryType },
            { moduleId: 2, type: 'test' },
        ];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result.entryType).toEqual(expectedEntryType);
    });

    it('prefers moduleId, if available', () => {
        // Arrange
        const reasons: any = [{ moduleId: 1, moduleName: 'testName', type: 'test' }];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1']);
    });

    it('uses moduleName if moduleId is missing', () => {
        // Arrange
        const reasons: any = [{ moduleId: null, moduleName: 'testName', type: 'test' }];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['testName']);
    });

    it('filters out entry points', () => {
        // Arrange
        const reasons: any = [
            { moduleId: 1, type: 'test' },
            { moduleId: null, type: 'test entry' },
            { moduleId: 3, type: 'test' },
        ];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1', 'module3']);
    });

    it('filters out duplicates', () => {
        // Arrange
        const reasons: any = [
            { moduleId: 1, type: 'test' },
            { moduleId: 1, type: 'test' },
            { moduleId: 1, type: 'test' },
        ];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1']);
    });

    it('distinguishes direct and lazy parents', () => {
        // Arrange
        const reasons: any = [
            { moduleId: 1, type: 'test' },
            { moduleId: 2, type: 'import()' },
            { moduleId: 3, type: 'test' },
        ];

        // Act
        const result = processReasons(reasons, moduleIdToNameMap);

        // Assert
        expect(result).toEqual({
            parents: ['module1', 'module3', 'module2'],
            directParents: ['module1', 'module3'],
            lazyParents: ['module2'],
        });
    });
});

import { processModule, getParents } from '../../src/api/deriveBundleData/deriveGraph';

const moduleIdToNameMap: any = new Map([
    [1, 'module1'],
    [2, 'module2'],
    [3, 'module3'],
]);

const namedChunkGroupLookupMap: any = { getNamedChunkGroups: () => ['chunkGroup1'] };

describe('processModule', () => {
    it('skips ignored modules', () => {
        // Arrange
        const graph: any = {};
        const module: any = { identifier: 'ignored module1' };

        // Act
        processModule(module, graph, moduleIdToNameMap, namedChunkGroupLookupMap);

        // Assert
        expect(graph).toEqual({});
    });

    it('adds individual modules', () => {
        // Arrange
        const graph: any = {};
        const module: any = {
            id: 1,
            identifier: 'module1',
            name: 'module1',
            reasons: [],
            chunks: [1, 2, 3],
            size: 123,
        };

        // Act
        processModule(module, graph, moduleIdToNameMap, namedChunkGroupLookupMap);

        // Assert
        expect(graph[module.name]).toEqual({
            name: 'module1',
            parents: [],
            directParents: [],
            lazyParents: [],
            namedChunkGroups: ['chunkGroup1'],
            size: 123,
        });
    });

    it('for hoisted modules, treats the first as primary', () => {
        // Arrange
        const graph: any = {};
        const module: any = {
            identifier: 'testId',
            name: 'module1 + N other modules',
            reasons: [],
            chunks: [1, 2, 3],
            size: 123,
            modules: [{ name: 'module1', size: 456 }],
        };

        // Act
        processModule(module, graph, moduleIdToNameMap, namedChunkGroupLookupMap);

        // Assert
        expect(graph['module1']).toEqual({
            name: 'module1',
            parents: [],
            directParents: [],
            lazyParents: [],
            containsHoistedModules: true,
            namedChunkGroups: ['chunkGroup1'],
            size: 456,
        });
    });

    it('adds subsequent hoisted modules as children of the first', () => {
        // Arrange
        const graph: any = {};
        const module: any = {
            identifier: 'testId',
            name: 'module1 + N other modules',
            reasons: [],
            chunks: [1, 2, 3],
            size: 123,
            modules: [
                { name: 'module1', size: 456 },
                { name: 'module2', size: 789 },
            ],
        };

        // Act
        processModule(module, graph, moduleIdToNameMap, namedChunkGroupLookupMap);

        // Assert
        expect(graph['module2']).toEqual({
            name: 'module2',
            parents: ['module1'],
            directParents: ['module1'],
            lazyParents: [],
            namedChunkGroups: ['chunkGroup1'],
            size: 789,
        });
    });

    it('throws when adding a duplicate node', () => {
        // Arrange
        const graph: any = { module1: {} };
        const module: any = {
            id: 1,
            identifier: 'module1',
            name: 'module1',
            reasons: [],
            chunks: [],
            size: 0,
        };

        // Act / Assert
        expect(() => {
            processModule(module, graph, moduleIdToNameMap, namedChunkGroupLookupMap);
        }).toThrow();
    });
});

describe('getParents', () => {
    it('maps module IDs to names', () => {
        // Arrange
        const reasons: any = [{ moduleId: 1 }, { moduleId: 2 }, { moduleId: 3 }];

        // Act
        const result = getParents(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1', 'module2', 'module3']);
    });

    it('prefers moduleId, if available', () => {
        // Arrange
        const reasons: any = [{ moduleId: 1, moduleName: 'testName' }];

        // Act
        const result = getParents(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1']);
    });

    it('uses moduleName if moduleId is missing', () => {
        // Arrange
        const reasons: any = [{ moduleId: null, moduleName: 'testName' }];

        // Act
        const result = getParents(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['testName']);
    });

    it('filters out entry points', () => {
        // Arrange
        const reasons: any = [{ moduleId: 1 }, { moduleId: null }, { moduleId: 3 }];

        // Act
        const result = getParents(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1', 'module3']);
    });

    it('filters out duplicates', () => {
        // Arrange
        const reasons: any = [{ moduleId: 1 }, { moduleId: 1 }, { moduleId: 1 }];

        // Act
        const result = getParents(reasons, moduleIdToNameMap);

        // Assert
        expect(result.parents).toEqual(['module1']);
    });

    it('distinguishes direct and lazy parents', () => {
        // Arrange
        const reasons: any = [
            {
                moduleId: 1,
                type: 'other',
            },
            {
                moduleId: 2,
                type: 'import()',
            },
            {
                moduleId: 3,
                type: 'other',
            },
        ];

        // Act
        const result = getParents(reasons, moduleIdToNameMap);
        console.log(JSON.stringify(result));

        // Assert
        expect(result).toEqual({
            parents: ['module1', 'module3', 'module2'],
            directParents: ['module1', 'module3'],
            lazyParents: ['module2'],
        });
    });
});

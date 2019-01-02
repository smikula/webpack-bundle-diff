import { addPrimaryModuleToGraph, addHoistedModulesToGraph } from '../../src/api/deriveBundleData';

describe('addPrimaryModuleToGraph', () => {
    it('creates and adds a node for the module', () => {
        // Arrange
        const id = 'testId';
        const graph: any = {};

        const primaryModule: any = {
            id,
            reasons: [],
            chunks: [1, 2, 3],
            size: 123,
        };

        // Act
        addPrimaryModuleToGraph(primaryModule, graph);

        // Assert
        expect(graph[id]).toEqual({
            parents: [],
            containsHoistedModules: false,
            chunks: [1, 2, 3],
            size: 123,
        });
    });

    it('throws when adding a duplicate node', () => {
        // Arrange
        const id = 'testId';
        const graph: any = { [id]: {} };
        const primaryModule: any = { id };

        // Act / Assert
        expect(() => {
            addPrimaryModuleToGraph(primaryModule, graph);
        }).toThrow();
    });
});

describe('addHoistedModulesToGraph', () => {
    it('creates and adds nodes for the modules', () => {
        // Arrange
        const graph: any = {};
        const id = 'testId';
        const primaryModule: any = {
            id,
            chunks: ['chunk1'],
            modules: [{ name: 'hoisted1', size: 123 }, { name: 'hoisted2', size: 456 }],
        };

        // Act
        addHoistedModulesToGraph(primaryModule, graph);

        // Assert
        expect(graph).toEqual({
            hoisted1: {
                parents: [id],
                chunks: ['chunk1'],
                size: 123,
            },
            hoisted2: {
                parents: [id],
                chunks: ['chunk1'],
                size: 456,
            },
        });
    });

    it('updates the size for the primary module', () => {
        // Arrange
        const id = 'testId';
        const graph: any = { [id]: { size: 123 } };
        const primaryModule: any = {
            id,
            modules: [{ name: id, size: 456 }],
        };

        // Act
        addHoistedModulesToGraph(primaryModule, graph);

        // Assert
        expect(graph[id].size).toBe(456);
    });

    it('throws when adding a duplicate node', () => {
        // Arrange
        const id1 = 'testId1';
        const id2 = 'testId2';
        const graph: any = { [id1]: { size: 123 } };
        const primaryModule: any = {
            id2,
            modules: [{ name: id1 }],
        };

        // Act / Assert
        expect(() => {
            addHoistedModulesToGraph(primaryModule, graph);
        }).toThrow();
    });
});

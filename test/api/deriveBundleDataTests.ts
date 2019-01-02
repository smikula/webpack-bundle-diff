import { addModuleToGraph } from '../../src/api/deriveBundleData';

describe('addModuleToGraph', () => {
    it('creates and adds a node for the module', () => {
        // Arrange
        const id = 'testId';
        const graph: any = {};

        const newModule: any = {
            id,
            reasons: [],
            chunks: [1, 2, 3],
            size: 123,
        };

        // Act
        addModuleToGraph(newModule, graph);

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
        const newModule: any = { id };

        // Act / Assert
        expect(() => {
            addModuleToGraph(newModule, graph);
        }).toThrow();
    });
});

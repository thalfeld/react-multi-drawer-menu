export interface ILink {
    id: string;
    title: string;
    url: string;
    sublinks?: ILink[];
}

function createLinks(prefix: string, count: number, sublinks?: ILink[]): ILink[] {
    const links = [];
    for (let i = 0; i < count; i++) {
        links.push({
            title: `${prefix}-${i}`,
            id: `${prefix}-${Math.random()}`,
            url: `${prefix}-${i}`,
            sublinks: i < 1 ? sublinks : null,
        });
    }
    return links;
}

const links = [
    ...createLinks(
        "levelA1",
        1,
        createLinks(
            "LevelB1",
            22,
            createLinks("LevelC1", 25, createLinks("LevelD1", 2, createLinks("LevelE1", 3)))
        )
    ),
    ...createLinks("levelA2", 1, createLinks("LevelB2", 8, createLinks("LevelC2", 5))),
    ...createLinks("levelA3", 15, createLinks("LevelB3", 10, createLinks("LevelC", 4))),
];

export { links };

import React, { useCallback, useMemo } from "react";
import useUiEventOutsideHandler from "../../hooks/use-ui-event-outside";
import "./navigation.scss";
import { ILink } from "./navigation.stubs";

const PANE_FULL_WIDTH = 300;
const PANE_SMALL_WIDTH = 30;

interface INavigationProps {
    links: ILink[];
}
interface IRenderLinks {
    links: ILink[];
    index: number;
    toggleCallback: (l: ILink, index: number) => void;
    isActive: (id: string) => boolean;
    open?: boolean;
    collapsed?: boolean;
    parent?: ILink;
}
const RenderLinks: React.FC<IRenderLinks> = (props) => {
    const { links, index, toggleCallback, isActive, open = false, collapsed, parent } = props;
    const activeLinksInList = links.find((i) => isActive(i.id));
    const anyActive = !!activeLinksInList;

    return (
        <div aria-controls={parent ? `submenu-${parent.id}` : undefined} className="submenu">
            {parent && (
                <button
                    onClick={() => {
                        toggleCallback(parent, index - 1);
                    }}
                    type="button"
                    tabIndex={-1}
                    className={`pane_title ${collapsed && "pane_title--collapsed"}`}
                >
                    {parent.title}
                </button>
            )}

            <ul className={`ul-level-${index}`}>
                {links.map((l: ILink, i: number) => {
                    const isCurrentlyActive = isActive(l.id);
                    return (
                        <li key={l.id}>
                            <a href={l.url} tabIndex={anyActive ? -1 : 0}>
                                {l.title}
                            </a>
                            {l.sublinks && (
                                <button
                                    className={`${collapsed ? "collapseButton" : ""}`}
                                    tabIndex={anyActive && !isCurrentlyActive ? -1 : 0}
                                    id={`submenu-${l.id}`}
                                    onClick={() => {
                                        toggleCallback(l, index);
                                    }}
                                >
                                    {isCurrentlyActive && <span>-</span>}
                                    {!isCurrentlyActive && <span>+</span>}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const Navigation: React.FC<INavigationProps> = (props) => {
    const rootRef = React.useRef(null);

    const [activeLinks, setActiveLinks] = React.useState<{ level: number; link: ILink }[]>([]);

    const closeAll = useCallback(() => {
        setActiveLinks([]);
    }, [setActiveLinks]);

    useUiEventOutsideHandler(rootRef, () => {
        console.log("outside");
        closeAll();
        rootRef.current.focus();
    });

    const isActive = (id: string) => {
        return !!activeLinks.find((l) => {
            return l.link.id === id;
        });
    };

    const toggleLink = (link: ILink, menuLevel: number) => {
        const index = menuLevel;
        const newLinksFrom = [...activeLinks.splice(0, index)];

        if (isActive(link.id)) {
            if (index > 0) {
                setActiveLinks(newLinksFrom);
            } else {
                setActiveLinks([]);
            }
            return;
        }
        setActiveLinks([...newLinksFrom, { level: menuLevel, link }]);
    };

    const placeholders = useMemo(() => {
        return [1, 2, 3, 4, 5, 6, 7, 8];
    }, []);

    return (
        <div ref={rootRef}>
            <nav role="navigation">
                <div className="pane pane--first">
                    <RenderLinks
                        toggleCallback={toggleLink}
                        open
                        index={0}
                        links={props.links}
                        isActive={isActive}
                    />
                </div>
                {placeholders.map((_, idx) => {
                    const isOpen = !!activeLinks[idx];
                    const parent = activeLinks[idx]?.link || undefined;
                    const small = activeLinks.length > 1 && idx < activeLinks.length - 1;
                    const classes = ["pane", "pane--level", `pane--level-${idx + 1}`];
                    if (isOpen) classes.push("pane--open");
                    if (small) classes.push("pane--collapsed");
                    if (idx === activeLinks.length - 2) classes.push("pane--second-last");
                    if (idx === activeLinks.length - 1) classes.push("pane--last");

                    return (
                        <div key={idx} className={classes.join(" ")}>
                            {isOpen && (
                                <RenderLinks
                                    isActive={isActive}
                                    key={idx}
                                    toggleCallback={toggleLink}
                                    open
                                    index={idx + 1}
                                    links={activeLinks[idx].link.sublinks}
                                    collapsed={small}
                                    parent={parent}
                                />
                            )}
                        </div>
                    );
                })}
            </nav>

            <div style={{ position: "fixed", top: 0, right: 0, textAlign: "right" }}>
                {JSON.stringify(
                    activeLinks.map((l) => {
                        return l.link.title;
                    })
                )}
            </div>
        </div>
    );
};

export default Navigation;

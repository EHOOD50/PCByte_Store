import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  FolderTree,
  Package,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import ConfirmDeleteModal from "./product/ConfirmDeleteModal";

export interface MenuGroup {
  id: number;
  title: string;
  color: string;
  cats: string[];
}

interface Category {
  id: number;
  name: string;
}

interface MenuBuilderProps {
  menuGroups: MenuGroup[];
  categories: Category[];
  categoryProductCounts: Record<
    string,
    number
  >;
  onSave: (
    groups: MenuGroup[]
  ) => Promise<void>;
}

const DEFAULT_COLORS = [
  "#0066FF",
  "#97cf00",
  "#8B5CF6",
  "#F97316",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#64748B",
];

const MenuBuilder: React.FC<
  MenuBuilderProps
> = ({
  menuGroups,
  categories,
  categoryProductCounts,
  onSave,
}) => {
  const [groups, setGroups] =
    useState<MenuGroup[]>(
      menuGroups
    );

  const [editingGroupId, setEditingGroupId] =
    useState<number | null>(null);

  const [groupToDelete, setGroupToDelete] =
    useState<MenuGroup | null>(null);

  const [saving, setSaving] =
    useState(false);

  const getGroupProductCount = (
    group: MenuGroup
  ) => {
    return group.cats.reduce(
      (total, categoryName) => {
        const normalizedName =
          categoryName
            .trim()
            .toUpperCase();

        return (
          total +
          (categoryProductCounts[
            normalizedName
          ] ?? 0)
        );
      },
      0
    );
  };

  const saveGroups = async (
    updatedGroups: MenuGroup[]
  ) => {
    setGroups(updatedGroups);
    setSaving(true);

    try {
      await onSave(updatedGroups);
    } finally {
      setSaving(false);
    }
  };

  const createGroup = () => {
    const nextId =
      groups.length > 0
        ? Math.max(
            ...groups.map(
              (group) => group.id
            )
          ) + 1
        : 1;

    const newGroup: MenuGroup = {
      id: nextId,
      title: "NUEVO GRUPO",
      color:
        DEFAULT_COLORS[
          groups.length %
            DEFAULT_COLORS.length
        ],
      cats: [],
    };

    const updatedGroups = [
      ...groups,
      newGroup,
    ];

    void saveGroups(updatedGroups);
    setEditingGroupId(nextId);
  };

  const updateGroupTitle = (
    groupId: number,
    title: string
  ) => {
    setGroups(
      (currentGroups) =>
        currentGroups.map(
          (group) =>
            group.id === groupId
              ? {
                  ...group,
                  title,
                }
              : group
        )
    );
  };

  const finishEditingTitle = (
    groupId: number
  ) => {
    const updatedGroups =
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              title:
                group.title.trim() ||
                "GRUPO SIN NOMBRE",
            }
          : group
      );

    setEditingGroupId(null);
    void saveGroups(updatedGroups);
  };

  const updateGroupColor = (
    groupId: number,
    color: string
  ) => {
    const updatedGroups =
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              color,
            }
          : group
      );

    void saveGroups(updatedGroups);
  };

  const addCategoryToGroup = (
    groupId: number,
    categoryName: string
  ) => {
    const updatedGroups =
      groups.map((group) => {
        if (
          group.id === groupId &&
          !group.cats.includes(
            categoryName
          )
        ) {
          return {
            ...group,
            cats: [
              ...group.cats,
              categoryName,
            ],
          };
        }

        return group;
      });

    void saveGroups(updatedGroups);
  };

  const removeCategoryFromGroup = (
    groupId: number,
    categoryName: string
  ) => {
    const updatedGroups =
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              cats:
                group.cats.filter(
                  (category) =>
                    category !==
                    categoryName
                ),
            }
          : group
      );

    void saveGroups(updatedGroups);
  };

  const moveGroup = (
    groupIndex: number,
    direction: "up" | "down"
  ) => {
    const destinationIndex =
      direction === "up"
        ? groupIndex - 1
        : groupIndex + 1;

    if (
      destinationIndex < 0 ||
      destinationIndex >=
        groups.length
    ) {
      return;
    }

    const updatedGroups = [
      ...groups,
    ];

    [
      updatedGroups[groupIndex],
      updatedGroups[
        destinationIndex
      ],
    ] = [
      updatedGroups[
        destinationIndex
      ],
      updatedGroups[groupIndex],
    ];

    void saveGroups(updatedGroups);
  };

  const confirmDeleteGroup =
    async () => {
      if (!groupToDelete) {
        return;
      }

      const updatedGroups =
        groups.filter(
          (group) =>
            group.id !==
            groupToDelete.id
        );

      setGroupToDelete(null);

      await saveGroups(
        updatedGroups
      );
    };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
            Configuración visual
          </p>

          <h2 className="mt-1 border-l-4 border-[#0066FF] pl-3 text-xl font-black uppercase italic">
            Arquitectura del Sidebar
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Crea grupos, cambia sus
            colores, ordénalos y asigna
            categorías.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={createGroup}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[10px] font-black uppercase text-[#97cf00] transition hover:bg-[#0066FF] hover:text-white"
          >
            <Plus size={18} />
            Nuevo grupo
          </button>

          <button
            type="button"
            onClick={() =>
              void saveGroups(groups)
            }
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#97cf00] px-6 py-3 text-[10px] font-black uppercase text-black shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {saving
              ? "Sincronizando..."
              : "Sincronizar UI"}
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-black uppercase text-slate-500">
            No existen grupos
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Pulsa “Nuevo grupo” para
            crear la primera sección del
            sidebar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {groups.map(
            (
              group,
              groupIndex
            ) => {
              const productCount =
                getGroupProductCount(
                  group
                );

              return (
                <div
                  key={group.id}
                  className="relative overflow-hidden rounded-[3rem] border-2 border-slate-100 bg-white p-8 shadow-sm"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-2"
                    style={{
                      backgroundColor:
                        group.color,
                    }}
                  />

                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <label
                        className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-100 shadow-sm"
                        style={{
                          backgroundColor:
                            group.color,
                        }}
                        title="Cambiar color"
                      >
                        <input
                          type="color"
                          value={
                            group.color
                          }
                          onChange={(
                            event
                          ) =>
                            updateGroupColor(
                              group.id,
                              event.target
                                .value
                            )
                          }
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>

                      <div className="min-w-0">
                        {editingGroupId ===
                        group.id ? (
                          <input
                            autoFocus
                            value={
                              group.title
                            }
                            onChange={(
                              event
                            ) =>
                              updateGroupTitle(
                                group.id,
                                event.target
                                  .value
                              )
                            }
                            onBlur={() =>
                              finishEditingTitle(
                                group.id
                              )
                            }
                            onKeyDown={(
                              event
                            ) => {
                              if (
                                event.key ===
                                "Enter"
                              ) {
                                finishEditingTitle(
                                  group.id
                                );
                              }
                            }}
                            className="w-full border-b-2 border-[#0066FF] bg-slate-50 px-2 py-1 text-lg font-black uppercase italic tracking-tighter outline-none"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setEditingGroupId(
                                group.id
                              )
                            }
                            className="group flex max-w-full items-center gap-2 text-left text-lg font-black uppercase italic tracking-tighter hover:text-[#0066FF]"
                          >
                            <span className="truncate">
                              {
                                group.title
                              }
                            </span>

                            <Edit3
                              size={14}
                              className="shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100"
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={
                          groupIndex === 0
                        }
                        onClick={() =>
                          moveGroup(
                            groupIndex,
                            "up"
                          )
                        }
                        className="rounded-xl bg-slate-100 p-2.5 text-slate-500 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Mover grupo hacia arriba"
                      >
                        <ArrowUp
                          size={16}
                        />
                      </button>

                      <button
                        type="button"
                        disabled={
                          groupIndex ===
                          groups.length -
                            1
                        }
                        onClick={() =>
                          moveGroup(
                            groupIndex,
                            "down"
                          )
                        }
                        className="rounded-xl bg-slate-100 p-2.5 text-slate-500 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Mover grupo hacia abajo"
                      >
                        <ArrowDown
                          size={16}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setGroupToDelete(
                            group
                          )
                        }
                        className="rounded-xl bg-red-100 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white"
                        aria-label={`Eliminar ${group.title}`}
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                      <div className="rounded-xl bg-[#0066FF]/10 p-2.5 text-[#0066FF]">
                        <FolderTree
                          size={18}
                        />
                      </div>

                      <div>
                        <p className="text-xl font-black text-slate-900">
                          {
                            group.cats
                              .length
                          }
                        </p>

                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          {group.cats
                            .length === 1
                            ? "Categoría"
                            : "Categorías"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                      <div className="rounded-xl bg-[#97cf00]/15 p-2.5 text-[#709700]">
                        <Package
                          size={18}
                        />
                      </div>

                      <div>
                        <p className="text-xl font-black text-slate-900">
                          {
                            productCount
                          }
                        </p>

                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          {productCount ===
                          1
                            ? "Producto"
                            : "Productos"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 flex min-h-[110px] flex-wrap content-start gap-2 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
                    {group.cats
                      .length === 0 ? (
                      <p className="m-auto text-center text-[10px] font-black uppercase text-slate-400">
                        Sin categorías
                        asignadas
                      </p>
                    ) : (
                      group.cats.map(
                        (category) => (
                          <div
                            key={
                              category
                            }
                            className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-4 py-2 shadow-sm"
                          >
                            <span className="text-[10px] font-black uppercase">
                              {
                                category
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeCategoryFromGroup(
                                  group.id,
                                  category
                                )
                              }
                              className="text-slate-300 transition hover:text-red-500"
                              aria-label={`Quitar ${category}`}
                            >
                              <X
                                size={14}
                              />
                            </button>
                          </div>
                        )
                      )
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="ml-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Categorías
                      disponibles
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {categories.filter(
                        (category) =>
                          !group.cats.includes(
                            category.name
                          )
                      ).length ===
                      0 ? (
                        <span className="text-[10px] font-bold text-slate-400">
                          Todas las
                          categorías están
                          asignadas a este
                          grupo.
                        </span>
                      ) : (
                        categories
                          .filter(
                            (category) =>
                              !group.cats.includes(
                                category.name
                              )
                          )
                          .map(
                            (category) => (
                              <button
                                key={
                                  category.id
                                }
                                type="button"
                                onClick={() =>
                                  addCategoryToGroup(
                                    group.id,
                                    category.name
                                  )
                                }
                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-[9px] font-black uppercase transition hover:bg-slate-900 hover:text-white"
                              >
                                +{" "}
                                {
                                  category.name
                                }
                              </button>
                            )
                          )
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={
          groupToDelete !== null
        }
        title="Eliminar grupo"
        message={
          groupToDelete
            ? groupToDelete.cats
                .length > 0
              ? `El grupo "${groupToDelete.title}" contiene ${groupToDelete.cats.length} categoría(s) y ${getGroupProductCount(groupToDelete)} producto(s). ¿Deseas eliminarlo de todas formas?`
              : `¿Estás seguro de que deseas eliminar el grupo "${groupToDelete.title}"?`
            : ""
        }
        onCancel={() =>
          setGroupToDelete(null)
        }
        onConfirm={
          confirmDeleteGroup
        }
      />
    </div>
  );
};

export default MenuBuilder;
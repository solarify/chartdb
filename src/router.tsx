import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { AuthWrapper } from './components/AuthWrapper/AuthWrapper';

const routes: RouteObject[] = [
    ...['', 'diagrams/:diagramId'].map((path) => ({
        path,
        async lazy() {
            const { EditorPage } = await import(
                './pages/editor-page/editor-page'
            );
            return {
                element: (
                    <AuthWrapper>
                        <EditorPage />
                    </AuthWrapper>
                ),
            };
        },
    })),
    {
        path: 'examples',
        async lazy() {
            const { ExamplesPage } = await import(
                './pages/examples-page/examples-page'
            );
            return {
                element: (
                    <AuthWrapper>
                        <ExamplesPage />
                    </AuthWrapper>
                ),
            };
        },
    },
    {
        id: 'templates',
        path: 'templates',
        async lazy() {
            const { TemplatesPage } = await import(
                './pages/templates-page/templates-page'
            );
            return {
                element: (
                    <AuthWrapper>
                        <TemplatesPage />
                    </AuthWrapper>
                ),
            };
        },
    },
    {
        id: 'templates_featured',
        path: 'templates/featured',
        async lazy() {
            const { TemplatesPage } = await import(
                './pages/templates-page/templates-page'
            );
            return {
                element: (
                    <AuthWrapper>
                        <TemplatesPage />
                    </AuthWrapper>
                ),
            };
        },
    },
    {
        id: 'templates_tags',
        path: 'templates/tags/:tag',
        async lazy() {
            const { TemplatesPage } = await import(
                './pages/templates-page/templates-page'
            );
            return {
                element: (
                    <AuthWrapper>
                        <TemplatesPage />
                    </AuthWrapper>
                ),
            };
        },
    },
    {
        path: 'templates/:templateSlug',
        async lazy() {
            const { TemplatePage } = await import(
                './pages/template-page/template-page'
            );
            return {
                element: (
                    <AuthWrapper>
                        <TemplatePage />
                    </AuthWrapper>
                ),
            };
        },
    },
    {
        path: '*',
        async lazy() {
            const { NotFoundPage } = await import(
                './pages/not-found-page/not-found-page'
            );
            return {
                element: (
                    <AuthWrapper>
                        <NotFoundPage />
                    </AuthWrapper>
                ),
            };
        },
    },
    {
        path: '/login',
        async lazy() {
            const { LoginPage } = await import('./pages/LoginPage/LoginPage');
            return {
                element: <LoginPage />,
            };
        },
    },
];

export const router = createBrowserRouter(routes);

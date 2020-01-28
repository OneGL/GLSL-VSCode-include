import { DocumentSymbolProvider, TextDocument, CancellationToken, ProviderResult, SymbolInformation, DocumentSymbol, SymbolKind } from 'vscode';
import { GlslProcessor } from '../core/glsl-processor';
import { Helper } from '../helper/helper';

export class GlslDocumentSymbolProvider implements DocumentSymbolProvider {

    //TODO:
    //interface blokkok, változódeklarációk

    public provideDocumentSymbols(document: TextDocument, token: CancellationToken): ProviderResult<SymbolInformation[] | DocumentSymbol[]> {
        GlslProcessor.processDocument(document);
        const documentInfo = GlslProcessor.getDocumentInfo(document.uri);
        const ret = new Array<DocumentSymbol>();
        for (const td of documentInfo.getRootScope().typeDeclarations) {
            const range = Helper.intervalToRange(td.structInterval, document);
            const selectionRange = Helper.intervalToRange(td.nameInterval, document);
            const ds = new DocumentSymbol(td.name, null, SymbolKind.Struct, range, selectionRange);
            for (const vd of td.members) {
                const range2 = Helper.intervalToRange(vd.declarationInterval, document);
                const selectionRange2 = Helper.intervalToRange(vd.nameInterval, document);
                const ds2 = new DocumentSymbol(vd.name, null, SymbolKind.Property, range2, selectionRange2);
                ds.children.push(ds2);
            }
            ret.push(ds);
        }
        for (const fd of documentInfo.functionDefinitions) {
            const range = Helper.intervalToRange(fd.interval, document);
            const selectionRange = Helper.intervalToRange(fd.nameInterval, document);
            ret.push(new DocumentSymbol(fd.name, fd.returnType.toString(), SymbolKind.Function, range, selectionRange));
        }
        return ret;
    }

}

import staticModule from 'static-module';
import copy from 'copy-asset';
import through from 'through2';
import path from 'path';

function write(buf, enc, next) {
    this.push(buf);
    next();
}

function brcopy(sm, file, bOpts, asset, opts = {}) {
    const stream = through(write, function end(next) {
        this.push(null);
        sm.emit('file', file);
        next();
    });

    opts.pkgLookUp = path.dirname(file);

    opts.relativePath = (fileMeta, cOpts) => {
        return cOpts.dest;
    };

    const fileMeta = copy.getFileMeta(path.dirname(file), asset, opts);

    copy(fileMeta, opts)
        .then((filemeta) => {
            stream.end('\'' + JSON.stringify(filemeta) + '\'');
        })
        .catch((err) => {
            sm.emit('error', err);
        });

    return stream;
}

export default (file, bOpts) => {

    const sm = staticModule({
        'copy-asset'(asset, opts = {}) {
            return brcopy(sm, file, bOpts, asset, opts);
        }
    });

    return sm;
};

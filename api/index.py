import json
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from typing import Union
from pydantic import BaseModel

from lib.dao import get_item_by_key, get_all_item, delete_item_by_key, delete_item_by_keys, add_item_by_key_value, \
    update_item_by_key

app = FastAPI(docs_url=None, redoc_url=None)


class UrlObject(BaseModel):
    value: Union[str, None] = None


class DelList(BaseModel):
    keys: list


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}


@app.get("/{item_id}", response_class=RedirectResponse, status_code=302)
async def redirect_pydantic(item_id):
    print(item_id)
    if get_item_by_key(item_id):
        url_obj = get_item_by_key(item_id)
        key = url_obj.get('key')
        value = url_obj.get('value')
    else:
        key = item_id
        value = '/#404'
    return value


"""
    @desc: 提供给后端查询使用的接口
"""


# 通过key获取所有短链接
@app.get("/api/{item_id}")
async def read_item(item_id):
    print(item_id)
    if get_item_by_key(item_id):
        url_obj = get_item_by_key(item_id)
        key = url_obj.get('key')
        value = url_obj.get('value')
    else:
        key = item_id
        value = 'object not found.'
    result = {
        "key": key,
        "value": value
    }
    return result


# 获取所有短链接
@app.get("/api/url/")
async def read_item_all():
    res = list()

    item_list = get_all_item()
    for item in item_list:
        item_a = {"id": item.id, "key": item.get('key'), "value": item.get('value'), "createdAt": str(item.created_at),
                  "updatedAt": str(item.updated_at)}
        res.append(item_a)

    return json.loads(json.dumps(res).encode('utf8'))


# 删除一个短链接
@app.delete("/api/{item_id}")
async def delete_item(item_id):
    key = item_id
    result = delete_item_by_key(key)
    if result:
        comment = '删除成功'
    else:
        comment = '对象不存在，删除失败'
    res = {
        "result": result,
        "comment": comment
    }
    return res


# 批量删除短链接
@app.delete("/api/url/")
async def delete_item_list(body: DelList):
    to_del_key_list = list()
    to_del_key_list = body.keys
    if len(to_del_key_list) > 0:
        result = delete_item_by_keys(to_del_key_list)
        comment = '批量删除完成'
    else:
        comment = '列表为空，无法批量删除'
        result = False
    res = {
        "result": result,
        "comment": comment
    }
    return res


# 新增一个短链接
@app.post("/api/{item_id}")
async def add_item(item_id: str, body: UrlObject):
    key = item_id
    value = body.value
    result = add_item_by_key_value(key, value)
    if result:
        comment = f'{key}=>{value} 添加成功'
    else:
        comment = '添加失败'
    res = {
        "result": result,
        "comment": comment
    }
    return res


@app.put("/api/{item_id}")
async def add_item(item_id: str, body: UrlObject):
    key = item_id
    value = body.value
    result = update_item_by_key(key, value)
    if result:
        comment = f'{key}=>{value} 修改成功'
    else:
        comment = '修改失败'
    res = {
        "result": result,
        "comment": comment
    }
    return res

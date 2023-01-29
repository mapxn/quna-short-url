import os
import leancloud
from leancloud import LeanCloudError, Object
from dotenv import load_dotenv

load_dotenv()
app_id = os.getenv('AppID')
app_key = os.getenv('AppKey')
leancloud.init(app_id, app_key)

UrlObj = leancloud.Object.extend('UrlObject')


def get_all_item() -> list:
    query = UrlObj.query
    obj_list = query.find()
    return obj_list


def get_item_by_key(key: str) -> Object:
    query = UrlObj.query.equal_to('key', key)
    try:
        result = query.first()
    except LeanCloudError:
        print("Object not found")
        result = 0
    return result


def add_item_by_key_value(key: str, value: str) -> bool:
    if get_item_by_key(key):
        print('对象已经存在，无法存入')
        return False
    else:
        item = UrlObj()
        item.set('key', key)
        item.set('value', value)
        item.save()
        print(f'key:{key},value:{value} 已经写入云端')
        return True


def delete_item_by_key(key: str) -> bool:
    if get_item_by_key(key):
        item_id = get_item_by_key(key).id
        print(f"对象:{item_id}存在，可以删除")
        item = UrlObj.create_without_data(get_item_by_key(key).id)
        item.destroy()
        return True
    else:
        print('对象不存在，无法删除')
        return False


def delete_item_by_keys(keys: list) -> bool:
    to_del_list = list()
    for key in keys:
        item = get_item_by_key(key)
        if item:
            to_del_list.append(item)
        else:
            print(f"key:{key}不存在，无法删除")
    UrlObj.destroy_all(to_del_list)
    return len(to_del_list) > 0


def update_item_by_key(key: str, value: str) -> bool:
    if get_item_by_key(key):
        print('对象存在，可以更新')
        item_id = get_item_by_key(key).id
        item = UrlObj.create_without_data(item_id)
        item.set('value', value)
        item.save()
        return True
    else:
        print('对象不存在，不能更新')
        return False
